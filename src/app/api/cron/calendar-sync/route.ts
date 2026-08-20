import { isDatabaseConfigured } from "@/lib/env";
import { assertCronAuthorized } from "@/server/lib/cron";
import { syncGoogleCalendars, syncIcalImports } from "@/server/services/calendar-sync.service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = assertCronAuthorized(req);
  if (denied) return denied;
  if (!isDatabaseConfigured) return Response.json({ skipped: true });
  const ical = await syncIcalImports();
  const google = await syncGoogleCalendars();
  return Response.json({ ical, google });
}
