import { notFound } from "next/navigation";
import { getCurrentAppUser } from "@/server/policies/auth.policy";
import { getGuestBookingByReference } from "@/server/services/booking-query.service";
import { BookingDetailSkeleton } from "@/components/feedback/data-skeletons";
import { BookingDetail } from "./booking-detail";
import { isDatabaseConfigured } from "@/lib/env";

export default async function BookingDetailPage({
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
  return <BookingDetail booking={booking} />;
}
