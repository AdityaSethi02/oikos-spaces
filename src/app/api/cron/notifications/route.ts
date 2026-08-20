import { isDatabaseConfigured } from "@/lib/env";
import { assertCronAuthorized } from "@/server/lib/cron";
import { processNotificationOutbox } from "@/server/services/notification.service";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const denied = assertCronAuthorized(req);
  if (denied) return denied;
  if (!isDatabaseConfigured) return Response.json({ processed: 0, skipped: true });
  const result = await processNotificationOutbox();
  return Response.json(result);
}
