import { listAdminHostAccounts } from "@/server/services/host-management.service";
import { AdminTablePageSkeleton } from "@/components/feedback/data-skeletons";
import { AdminUsersClient } from "./users-client";
import { isDatabaseConfigured } from "@/lib/env";

export const metadata = { title: "Team" };

export default async function AdminUsersPage() {
  if (!isDatabaseConfigured) {
    return <AdminTablePageSkeleton />;
  }

  const hosts = await listAdminHostAccounts();
  return <AdminUsersClient hosts={hosts} />;
}
