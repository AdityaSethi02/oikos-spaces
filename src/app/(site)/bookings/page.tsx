import { requireAuthUser } from "@/server/policies/auth.policy";
import { listGuestBookings } from "@/server/services/booking-query.service";
import { BookingsListSkeleton } from "@/components/feedback/data-skeletons";
import { BookingsList } from "./bookings-list";
import { isDatabaseConfigured } from "@/lib/env";

export const metadata = { title: "My bookings" };
export const dynamic = "force-dynamic";

export default async function BookingsPage() {
  if (!isDatabaseConfigured) {
    return <BookingsListSkeleton />;
  }

  const user = await requireAuthUser();
  const bookings = await listGuestBookings(user);
  return <BookingsList bookings={bookings} />;
}
