import type { NotificationChannel } from "@prisma/client";
import { isDatabaseConfigured } from "@/lib/env";
import prisma from "@/lib/prisma";
import { sendEmail } from "@/server/integrations/notifications/email";
import {
  renderNotification,
  type NotificationTemplate,
  type TemplatePayload,
} from "@/server/integrations/notifications/templates";
import { sendWhatsApp } from "@/server/integrations/notifications/whatsapp";

export async function enqueueNotification(input: {
  channel: NotificationChannel;
  template: NotificationTemplate;
  recipient: string;
  payload: TemplatePayload;
  idempotencyKey: string;
  scheduledAt?: Date;
}): Promise<void> {
  if (!isDatabaseConfigured || !input.recipient) return;
  try {
    await prisma.notificationOutbox.create({
      data: {
        channel: input.channel,
        template: input.template,
        recipient: input.recipient,
        payload: input.payload as object,
        idempotencyKey: input.idempotencyKey,
        scheduledAt: input.scheduledAt ?? new Date(),
      },
    });
  } catch {
    // Unique idempotency key — already queued
  }
}

export async function enqueueGuestAndHost(input: {
  template: NotificationTemplate;
  guestEmail?: string | null;
  guestPhone?: string | null;
  payload: TemplatePayload;
  idempotencyKey: string;
}): Promise<void> {
  const settings = await getHostSettings();
  if (input.guestEmail && settings.emailNotifications) {
    await enqueueNotification({
      channel: "EMAIL",
      template: input.template,
      recipient: input.guestEmail,
      payload: input.payload,
      idempotencyKey: `${input.idempotencyKey}:email:${input.guestEmail}`,
    });
  }
  if (input.guestPhone && settings.whatsappAlerts) {
    await enqueueNotification({
      channel: "WHATSAPP",
      template: input.template,
      recipient: input.guestPhone,
      payload: input.payload,
      idempotencyKey: `${input.idempotencyKey}:wa:${input.guestPhone}`,
    });
  }
}

export async function getHostSettings() {
  if (!isDatabaseConfigured) {
    return {
      emailNotifications: true,
      whatsappAlerts: false,
      bookingReminders: true,
      whatsappNumber: null as string | null,
      directPaymentInstructions: null as string | null,
    };
  }
  return prisma.hostSettings.upsert({
    where: { id: "default" },
    create: { id: "default" },
    update: {},
  });
}

export async function processNotificationOutbox(limit = 25) {
  if (!isDatabaseConfigured) return { processed: 0, skipped: true as const };
  const due = await prisma.notificationOutbox.findMany({
    where: {
      status: "PENDING",
      scheduledAt: { lte: new Date() },
    },
    orderBy: { scheduledAt: "asc" },
    take: limit,
  });

  let processed = 0;
  for (const item of due) {
    const claimed = await prisma.notificationOutbox.updateMany({
      where: { id: item.id, status: "PENDING" },
      data: { attempts: { increment: 1 } },
    });
    if (claimed.count === 0) continue;

    const rendered = renderNotification(
      item.template as NotificationTemplate,
      (item.payload ?? {}) as TemplatePayload,
    );
    const result =
      item.channel === "EMAIL"
        ? await sendEmail({ to: item.recipient, ...rendered })
        : await sendWhatsApp({ to: item.recipient, text: rendered.text });

    if (result.ok) {
      await prisma.notificationOutbox.update({
        where: { id: item.id },
        data: { status: "SENT", sentAt: new Date(), lastError: null },
      });
    } else {
      await prisma.notificationOutbox.update({
        where: { id: item.id },
        data: {
          status: item.attempts + 1 >= 5 ? "FAILED" : "PENDING",
          lastError: result.error,
        },
      });
    }
    processed += 1;
  }

  return { processed };
}

export async function listHostEmails(): Promise<string[]> {
  if (!isDatabaseConfigured) return [];
  const hosts = await prisma.hostAccount.findMany({
    where: { isActive: true },
    select: { email: true },
  });
  return hosts.map((host) => host.email);
}
