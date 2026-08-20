import { buildIcalExport } from "@/server/services/calendar-sync.service";
import { isDatabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  context: { params: Promise<{ token: string }> },
) {
  if (!isDatabaseConfigured) {
    return new Response("Calendar is not configured", { status: 503 });
  }
  const { token } = await context.params;
  const ics = await buildIcalExport(token);
  if (!ics) return new Response("Not found", { status: 404 });
  return new Response(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": "attachment; filename=oikos-spaces.ics",
      "Cache-Control": "no-store",
    },
  });
}
