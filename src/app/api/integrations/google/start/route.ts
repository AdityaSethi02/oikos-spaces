import { NextResponse } from "next/server";
import { isGoogleCalendarConfigured } from "@/lib/env";
import { requireAdminHost } from "@/server/policies/auth.policy";
import { googleOAuthUrl } from "@/server/services/calendar-sync.service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  await requireAdminHost();
  if (!isGoogleCalendarConfigured) {
    return NextResponse.redirect(new URL("/admin/settings?google=missing", req.url));
  }
  const propertyId = new URL(req.url).searchParams.get("propertyId");
  if (!propertyId) {
    return NextResponse.redirect(new URL("/admin/settings?google=property", req.url));
  }
  const state = Buffer.from(JSON.stringify({ propertyId, t: Date.now() })).toString("base64url");
  return NextResponse.redirect(googleOAuthUrl(state));
}
