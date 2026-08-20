import { listAdminPayments } from "@/server/services/payment.service";
import { AdminTablePageSkeleton } from "@/components/feedback/data-skeletons";
import { AdminPaymentsClient } from "./payments-client";
import { isDatabaseConfigured } from "@/lib/env";

export const metadata = { title: "Payments" };
export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  if (!isDatabaseConfigured) {
    return <AdminTablePageSkeleton />;
  }

  const payments = await listAdminPayments();
  return <AdminPaymentsClient payments={payments} />;
}
