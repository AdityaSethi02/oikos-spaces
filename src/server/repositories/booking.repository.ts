import type { Booking, BookingStatus, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";

const HOLDING_STATUSES: BookingStatus[] = [
  "RESERVED",
  "PAYMENT_PENDING",
  "CONFIRMED",
  "CHECKED_IN",
];

export const bookingRepository = {
  findById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        property: { include: { amenities: { include: { amenity: true } }, bedroomDetails: true, media: true } },
        guest: true,
        payments: true,
        conversation: true,
        reviews: { select: { id: true } },
      },
    });
  },

  findByReference(bookingReference: string) {
    return prisma.booking.findUnique({
      where: { bookingReference },
      include: {
        property: { include: { amenities: { include: { amenity: true } }, bedroomDetails: true, media: true } },
        guest: true,
        payments: true,
        conversation: true,
        reviews: { select: { id: true } },
      },
    });
  },

  findByIdempotencyKey(idempotencyKey: string) {
    return prisma.booking.findUnique({ where: { idempotencyKey } });
  },

  listByGuest(guestId: string) {
    return prisma.booking.findMany({
      where: { guestId },
      include: {
        property: { include: { amenities: { include: { amenity: true } }, bedroomDetails: true, media: true } },
        payments: true,
        conversation: true,
        reviews: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  listHoldingForProperty(propertyId: string) {
    return prisma.booking.findMany({
      where: {
        propertyId,
        status: { in: HOLDING_STATUSES },
      },
      select: {
        id: true,
        status: true,
        checkInDate: true,
        checkOutDate: true,
        reservationExpiresAt: true,
      },
    });
  },

  create(data: Prisma.BookingCreateInput): Promise<Booking> {
    return prisma.booking.create({ data });
  },
};
