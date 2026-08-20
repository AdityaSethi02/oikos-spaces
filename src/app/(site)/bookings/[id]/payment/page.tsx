import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageLoading } from "@/components/feedback/page-loading";
import { BookingDetailSkeleton } from "@/components/feedback/data-skeletons";
import { getCurrentAppUser } from "@/server/policies/auth.policy";
import { getGuestBookingByReference } from "@/server/services/booking-query.service";
import { isDatabaseConfigured } from "@/lib/env";
import PaymentContent from "./payment-content";

export const metadata = { title: "Payment" };

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isDatabaseConfigured) {
    return <BookingDetailSkeleton />;
  }

  const { id } = await params;
  const user = await getCurrentAppUser();
  const booking = await getGuestBookingByReference(id, user);
  if (!booking) notFound();

  return (
    <Suspense fallback={<PageLoading label="Loading payment" />}>
      <PaymentContent booking={booking} />
    </Suspense>
  );
}
