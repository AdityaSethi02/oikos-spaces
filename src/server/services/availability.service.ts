import type { BookingStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { formatDateOnly, rangesOverlap } from "@/server/lib/dates";
import { blockRepository } from "@/server/repositories/block.repository";
import { bookingRepository } from "@/server/repositories/booking.repository";

const HOLDING: BookingStatus[] = [
  "RESERVED",
  "PAYMENT_PENDING",
  "CONFIRMED",
  "CHECKED_IN",
];

export async function expireReservations(now = new Date()): Promise<number> {
  const result = await prisma.booking.updateMany({
    where: {
      status: "RESERVED",
      reservationExpiresAt: { lte: now },
    },
    data: { status: "EXPIRED" },
  });
  return result.count;
}

function isActiveHold(
  booking: {
    status: BookingStatus;
    reservationExpiresAt: Date | null;
  },
  now: Date,
): boolean {
  if (!HOLDING.includes(booking.status)) return false;
  if (
    booking.status === "RESERVED" &&
    booking.reservationExpiresAt &&
    booking.reservationExpiresAt <= now
  ) {
    return false;
  }
  return true;
}

export async function getUnavailableDates(
  propertyId: string,
  from: string,
  to: string,
): Promise<string[]> {
  await expireReservations();
  const [bookings, blocks] = await Promise.all([
    bookingRepository.listHoldingForProperty(propertyId),
    blockRepository.listForProperty(propertyId),
  ]);
  const now = new Date();
  const blocked = new Set<string>();

  const occupy = (start: string, end: string) => {
    if (!rangesOverlap(from, to, start, end)) return;
    const cursorStart = start > from ? start : from;
    const cursorEnd = end < to ? end : to;
    let day = cursorStart;
    while (day < cursorEnd) {
      blocked.add(day);
      const next = new Date(`${day}T00:00:00.000Z`);
      next.setUTCDate(next.getUTCDate() + 1);
      day = formatDateOnly(next);
    }
  };

  for (const booking of bookings) {
    if (!isActiveHold(booking, now)) continue;
    occupy(formatDateOnly(booking.checkInDate), formatDateOnly(booking.checkOutDate));
  }
  for (const block of blocks) {
    occupy(formatDateOnly(block.startDate), formatDateOnly(block.endDate));
  }

  return [...blocked].sort();
}

export async function isRangeAvailable(
  propertyId: string,
  checkIn: string,
  checkOut: string,
  ignoreBookingId?: string,
): Promise<boolean> {
  await expireReservations();
  const now = new Date();
  const [bookings, blocks] = await Promise.all([
    bookingRepository.listHoldingForProperty(propertyId),
    blockRepository.listForProperty(propertyId),
  ]);

  for (const booking of bookings) {
    if (ignoreBookingId && booking.id === ignoreBookingId) continue;
    if (!isActiveHold(booking, now)) continue;
    if (
      rangesOverlap(
        checkIn,
        checkOut,
        formatDateOnly(booking.checkInDate),
        formatDateOnly(booking.checkOutDate),
      )
    ) {
      return false;
    }
  }

  for (const block of blocks) {
    if (
      rangesOverlap(
        checkIn,
        checkOut,
        formatDateOnly(block.startDate),
        formatDateOnly(block.endDate),
      )
    ) {
      return false;
    }
  }

  return true;
}
