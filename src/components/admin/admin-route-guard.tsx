import { isDatabaseConfigured } from "@/lib/env";
import { requireAdminHost } from "@/server/policies/auth.policy";

export async function AdminRouteGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!isDatabaseConfigured) {
    return children;
  }
  await requireAdminHost();
  return children;
}
