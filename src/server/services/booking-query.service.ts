import type { User } from "@prisma/client";
import type { GuestBookingDto } from "@/server/dto/public.dto";
import { ForbiddenError, NotFoundError, UnauthorizedError } from "@/server/errors";
import { requireDatabase } from "@/server/lib/require-config";
import { toGuestBookingDto } from "@/server/mappers/booking.mapper";
import { bookingRepository } from "@/server/repositories/booking.repository";
import { expireReservations } from "@/server/services/availability.service";
import prisma from "@/lib/prisma";

export async function listGuestBookings(user: User): Promise<GuestBookingDto[]> {
  requireDatabase();
  await expireReservations();
  const rows = await bookingRepository.listByGuest(user.id);
  return rows.map((row) => toGuestBookingDto(row, { includePrivateAccess: true }));
}

export async function getGuestBookingByReference(
  reference: string,
  user: User | null,
): Promise<GuestBookingDto | null> {
  requireDatabase();
  if (!user) throw new UnauthorizedError();

  await expireReservations();
  const row = await bookingRepository.findByReference(reference);
  if (!row) return null;
  if (user.role !== "ADMIN_HOST" && row.guestId !== user.id) {
    throw new ForbiddenError();
  }
  const includePrivate =
    user.role === "ADMIN_HOST" || row.guestId === user.id;
  return toGuestBookingDto(row, { includePrivateAccess: includePrivate });
}

export function partitionGuestBookings(bookings: GuestBookingDto[]) {
  const upcoming = bookings.filter((booking) =>
    ["inquiry", "reserved", "payment_pending", "confirmed", "checked_in"].includes(
      booking.bookingStatus,
    ),
  );
  const completed = bookings.filter((booking) => booking.bookingStatus === "checked_out");
  const cancelled = bookings.filter((booking) =>
    ["cancelled", "expired"].includes(booking.bookingStatus),
  );
  return { upcoming, completed, cancelled };
}

export async function listAdminBookings(): Promise<GuestBookingDto[]> {
  requireDatabase();
  await expireReservations();
  const rows = await prisma.booking.findMany({
    include: {
      property: {
        include: { amenities: { include: { amenity: true } }, bedroomDetails: true, media: true },
      },
      guest: true,
      payments: true,
      conversation: true,
      reviews: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return rows.map((row) => toGuestBookingDto(row, { includePrivateAccess: true }));
}

export async function requireGuestBooking(reference: string, user: User) {
  const booking = await getGuestBookingByReference(reference, user);
  if (!booking) throw new NotFoundError("Booking not found");
  return booking;
}
