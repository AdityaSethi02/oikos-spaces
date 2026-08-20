import { isDatabaseConfigured } from "@/lib/env";
import { assertCronAuthorized } from "@/server/lib/cron";
import { enqueueStayReminders } from "@/server/services/checkin.service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = assertCronAuthorized(req);
  if (denied) return denied;
  if (!isDatabaseConfigured) return Response.json({ skipped: true });
  const result = await enqueueStayReminders();
  return Response.json(result);
}
