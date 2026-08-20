import { NextResponse } from "next/server";
import { storeGoogleRefreshToken } from "@/server/services/calendar-sync.service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  if (!code || !state) {
    return NextResponse.redirect(new URL("/admin/settings?google=denied", req.url));
  }
  try {
    const parsed = JSON.parse(Buffer.from(state, "base64url").toString("utf8")) as {
      propertyId?: string;
    };
    if (!parsed.propertyId) throw new Error("Missing property");
    await storeGoogleRefreshToken(parsed.propertyId, code);
    return NextResponse.redirect(new URL("/admin/settings?google=connected", req.url));
  } catch {
    return NextResponse.redirect(new URL("/admin/settings?google=error", req.url));
  }
}
