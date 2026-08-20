import { randomBytes } from "crypto";
import type { User } from "@prisma/client";
import { env, isDatabaseConfigured, isGoogleCalendarConfigured } from "@/lib/env";
import prisma from "@/lib/prisma";
import { formatDateOnly, rangesOverlap } from "@/server/lib/dates";
import { formatIcalCalendar, parseIcalEvents, type IcalEvent } from "@/server/integrations/calendar/ical";
import { ValidationError } from "@/server/errors";

async function ensureExportFeed(propertyId: string) {
  const existing = await prisma.calendarFeed.findUnique({
    where: { propertyId_kind: { propertyId, kind: "ICAL_EXPORT" } },
  });
  if (existing?.exportToken) return existing;
  return prisma.calendarFeed.upsert({
    where: { propertyId_kind: { propertyId, kind: "ICAL_EXPORT" } },
    create: {
      propertyId,
      kind: "ICAL_EXPORT",
      exportToken: randomBytes(24).toString("hex"),
    },
    update: { exportToken: randomBytes(24).toString("hex") },
  });
}

export async function getCalendarSettings(appUrl: string) {
  if (!isDatabaseConfigured) {
    return { properties: [] as Array<{
      id: string;
      name: string;
      slug: string;
      exportUrl: string | null;
      importUrl: string | null;
      googleConnected: boolean;
      lastSyncedAt: string | null;
      lastError: string | null;
    }>, googleConfigured: isGoogleCalendarConfigured };
  }

  const properties = await prisma.property.findMany({
    where: { deletedAt: null },
    include: { calendarFeeds: true },
    orderBy: { name: "asc" },
  });

  return {
    googleConfigured: isGoogleCalendarConfigured,
    properties: await Promise.all(
      properties.map(async (property) => {
        const exportFeed = await ensureExportFeed(property.id);
        const importFeed = property.calendarFeeds.find((feed) => feed.kind === "ICAL_IMPORT");
        const googleFeed = property.calendarFeeds.find((feed) => feed.kind === "GOOGLE");
        return {
          id: property.id,
          name: property.name,
          slug: property.slug,
          exportUrl: `${appUrl}/api/calendar/ical/${exportFeed.exportToken}`,
          importUrl: importFeed?.importUrl ?? null,
          googleConnected: Boolean(googleFeed?.googleRefreshToken),
          lastSyncedAt: (importFeed?.lastSyncedAt ?? googleFeed?.lastSyncedAt)?.toISOString() ?? null,
          lastError: importFeed?.lastError ?? googleFeed?.lastError ?? null,
        };
      }),
    ),
  };
}

export async function saveIcalImportUrl(input: {
  admin: User;
  propertyId: string;
  importUrl: string;
}) {
  if (!input.importUrl.startsWith("http://") && !input.importUrl.startsWith("https://")) {
    throw new ValidationError("Enter a valid https iCal URL");
  }
  await prisma.calendarFeed.upsert({
    where: { propertyId_kind: { propertyId: input.propertyId, kind: "ICAL_IMPORT" } },
    create: {
      propertyId: input.propertyId,
      kind: "ICAL_IMPORT",
      importUrl: input.importUrl,
      enabled: true,
    },
    update: { importUrl: input.importUrl, enabled: true, lastError: null },
  });
}

export async function buildIcalExport(token: string): Promise<string | null> {
  const feed = await prisma.calendarFeed.findUnique({
    where: { exportToken: token },
    include: { property: true },
  });
  if (!feed || !feed.enabled) return null;

  const [bookings, blocks] = await Promise.all([
    prisma.booking.findMany({
      where: {
        propertyId: feed.propertyId,
        status: { in: ["RESERVED", "PAYMENT_PENDING", "CONFIRMED", "CHECKED_IN"] },
      },
    }),
    prisma.propertyBlock.findMany({ where: { propertyId: feed.propertyId } }),
  ]);

  const events = [
    ...bookings.map((booking) => ({
      uid: `booking-${booking.bookingReference}@oikosspaces.com`,
      start: formatDateOnly(booking.checkInDate),
      end: formatDateOnly(booking.checkOutDate),
      summary: `OIKOS ${feed.property.name} (${booking.bookingReference})`,
    })),
    ...blocks.map((block) => ({
      uid: `block-${block.id}@oikosspaces.com`,
      start: formatDateOnly(block.startDate),
      end: formatDateOnly(block.endDate),
      summary: `Blocked — ${feed.property.name}`,
    })),
  ];
  return formatIcalCalendar(events);
}

export async function reconcileExternalEvents(input: {
  propertyId: string;
  feedId: string;
  events: IcalEvent[];
}) {
  const conflicts: string[] = [];
  const seen = new Set<string>();
  const holds = await prisma.booking.findMany({
    where: {
      propertyId: input.propertyId,
      status: { in: ["CONFIRMED", "CHECKED_IN"] },
    },
    select: { checkInDate: true, checkOutDate: true },
  });

  for (const event of input.events) {
    seen.add(event.uid);
    const hitsConfirmed = holds.some((booking) =>
      rangesOverlap(
        event.start,
        event.end,
        formatDateOnly(booking.checkInDate),
        formatDateOnly(booking.checkOutDate),
      ),
    );
    if (hitsConfirmed) {
      conflicts.push(event.uid);
      continue;
    }

    await prisma.propertyBlock.upsert({
      where: {
        propertyId_externalUid: {
          propertyId: input.propertyId,
          externalUid: event.uid,
        },
      },
      create: {
        propertyId: input.propertyId,
        startDate: new Date(event.start),
        endDate: new Date(event.end),
        reason: "EXTERNAL_BOOKING",
        source: "EXTERNAL",
        externalUid: event.uid,
        feedId: input.feedId,
        notes: event.summary,
      },
      update: {
        startDate: new Date(event.start),
        endDate: new Date(event.end),
        notes: event.summary,
        feedId: input.feedId,
      },
    });
  }

  const stale = await prisma.propertyBlock.findMany({
    where: {
      propertyId: input.propertyId,
      feedId: input.feedId,
      source: "EXTERNAL",
      externalUid: { not: null },
    },
  });
  for (const block of stale) {
    if (block.externalUid && !seen.has(block.externalUid)) {
      await prisma.propertyBlock.delete({ where: { id: block.id } });
    }
  }

  return { imported: seen.size, conflicts };
}

export async function syncIcalImports() {
  if (!isDatabaseConfigured) return { feeds: 0 };
  const feeds = await prisma.calendarFeed.findMany({
    where: { kind: "ICAL_IMPORT", enabled: true, importUrl: { not: null } },
  });
  let synced = 0;
  for (const feed of feeds) {
    try {
      const response = await fetch(feed.importUrl!);
      if (!response.ok) throw new Error(`Fetch failed (${response.status})`);
      const text = await response.text();
      const events = parseIcalEvents(text);
      const result = await reconcileExternalEvents({
        propertyId: feed.propertyId,
        feedId: feed.id,
        events,
      });
      await prisma.calendarFeed.update({
        where: { id: feed.id },
        data: {
          lastSyncedAt: new Date(),
          lastError: result.conflicts.length
            ? `Skipped ${result.conflicts.length} events that overlap confirmed bookings`
            : null,
        },
      });
      synced += 1;
    } catch (error) {
      await prisma.calendarFeed.update({
        where: { id: feed.id },
        data: {
          lastError: error instanceof Error ? error.message : "Sync failed",
        },
      });
    }
  }
  return { feeds: synced };
}

export function googleOAuthUrl(state: string) {
  const params = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID ?? "",
    redirect_uri: `${env.APP_URL}/api/integrations/google/callback`,
    response_type: "code",
    access_type: "offline",
    prompt: "consent",
    scope: "https://www.googleapis.com/auth/calendar.readonly",
    state,
  });
  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
}

export async function storeGoogleRefreshToken(propertyId: string, code: string) {
  const body = new URLSearchParams({
    code,
    client_id: env.GOOGLE_CLIENT_ID ?? "",
    client_secret: env.GOOGLE_CLIENT_SECRET ?? "",
    redirect_uri: `${env.APP_URL}/api/integrations/google/callback`,
    grant_type: "authorization_code",
  });
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) {
    throw new ValidationError("Google authorization failed");
  }
  const tokens = (await response.json()) as { refresh_token?: string };
  if (!tokens.refresh_token) {
    throw new ValidationError("Google did not return a refresh token");
  }
  await prisma.calendarFeed.upsert({
    where: { propertyId_kind: { propertyId, kind: "GOOGLE" } },
    create: {
      propertyId,
      kind: "GOOGLE",
      googleRefreshToken: tokens.refresh_token,
      enabled: true,
    },
    update: { googleRefreshToken: tokens.refresh_token, enabled: true, lastError: null },
  });
}

async function googleAccessToken(refreshToken: string) {
  const body = new URLSearchParams({
    client_id: env.GOOGLE_CLIENT_ID ?? "",
    client_secret: env.GOOGLE_CLIENT_SECRET ?? "",
    refresh_token: refreshToken,
    grant_type: "refresh_token",
  });
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!response.ok) throw new Error("Google token refresh failed");
  const json = (await response.json()) as { access_token?: string };
  if (!json.access_token) throw new Error("Missing access token");
  return json.access_token;
}

export async function syncGoogleCalendars() {
  if (!isDatabaseConfigured || !isGoogleCalendarConfigured) return { feeds: 0 };
  const feeds = await prisma.calendarFeed.findMany({
    where: { kind: "GOOGLE", enabled: true, googleRefreshToken: { not: null } },
  });
  let synced = 0;
  const timeMin = new Date();
  timeMin.setUTCMonth(timeMin.getUTCMonth() - 1);
  const timeMax = new Date();
  timeMax.setUTCFullYear(timeMax.getUTCFullYear() + 1);

  for (const feed of feeds) {
    try {
      const access = await googleAccessToken(feed.googleRefreshToken!);
      const url = new URL("https://www.googleapis.com/calendar/v3/calendars/primary/events");
      url.searchParams.set("singleEvents", "true");
      url.searchParams.set("timeMin", timeMin.toISOString());
      url.searchParams.set("timeMax", timeMax.toISOString());
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${access}` },
      });
      if (!response.ok) throw new Error(`Google events failed (${response.status})`);
      const json = (await response.json()) as {
        items?: Array<{
          id?: string;
          summary?: string;
          start?: { date?: string; dateTime?: string };
          end?: { date?: string; dateTime?: string };
        }>;
      };
      const events: IcalEvent[] = [];
      for (const item of json.items ?? []) {
        const start = item.start?.date ?? item.start?.dateTime?.slice(0, 10);
        const end = item.end?.date ?? item.end?.dateTime?.slice(0, 10);
        if (!item.id || !start || !end || start >= end) continue;
        events.push({ uid: item.id, start, end, summary: item.summary });
      }

      const result = await reconcileExternalEvents({
        propertyId: feed.propertyId,
        feedId: feed.id,
        events,
      });
      await prisma.calendarFeed.update({
        where: { id: feed.id },
        data: {
          lastSyncedAt: new Date(),
          lastError: result.conflicts.length
            ? `Skipped ${result.conflicts.length} events that overlap confirmed bookings`
            : null,
        },
      });
      synced += 1;
    } catch (error) {
      await prisma.calendarFeed.update({
        where: { id: feed.id },
        data: { lastError: error instanceof Error ? error.message : "Google sync failed" },
      });
    }
  }
  return { feeds: synced };
}
