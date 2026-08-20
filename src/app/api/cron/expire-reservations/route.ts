import { isDatabaseConfigured } from "@/lib/env";
import { assertCronAuthorized } from "@/server/lib/cron";
import { expireReservations } from "@/server/services/availability.service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = assertCronAuthorized(req);
  if (denied) return denied;
  if (!isDatabaseConfigured) return Response.json({ expired: 0, skipped: true });
  const expired = await expireReservations();
  return Response.json({ expired });
}
