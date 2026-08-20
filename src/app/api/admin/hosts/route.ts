import { requireAdminHost } from "@/server/policies/auth.policy";
import { listAdminHostAccounts } from "@/server/services/host-management.service";

export const dynamic = "force-dynamic";

export async function GET() {
  await requireAdminHost();
  const hosts = await listAdminHostAccounts();
  return Response.json({ hosts });
}
