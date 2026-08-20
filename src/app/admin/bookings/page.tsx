import { listAdminBookings } from "@/server/services/booking-query.service";
import { listPublicProperties } from "@/server/services/property.service";
import { AdminTablePageSkeleton } from "@/components/feedback/data-skeletons";
import { AdminBookingsClient } from "./bookings-client";
import { isDatabaseConfigured } from "@/lib/env";

export const metadata = { title: "Bookings" };

export default async function AdminBookingsPage() {
  if (!isDatabaseConfigured) {
    return <AdminTablePageSkeleton />;
  }

  const bookings = await listAdminBookings();
  const properties = await listPublicProperties();
  return <AdminBookingsClient bookings={bookings} properties={properties} />;
}
