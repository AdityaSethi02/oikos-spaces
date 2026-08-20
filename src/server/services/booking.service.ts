import type { Booking, BookingStatus, Prisma, User } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "@/server/errors";
import { isDateOnly, nightsBetween, parseDateOnly } from "@/server/lib/dates";
import { bookingRepository } from "@/server/repositories/booking.repository";
import { propertyRepository } from "@/server/repositories/property.repository";
import { expireReservations, isRangeAvailable } from "@/server/services/availability.service";
import { getActivePricingRulesForStay } from "@/server/services/pricing-rule.service";
import { quoteStay, toPricedProperty } from "@/server/services/pricing.service";
import { postSystemMessage } from "@/server/services/chat.service";
import { notifyInquiry } from "@/server/services/checkin.service";

const RESERVATION_MINUTES = 15;

async function quotePropertyStay(
  property: NonNullable<Awaited<ReturnType<typeof propertyRepository.findActiveBySlug>>>,
  checkIn: string,
  checkOut: string,
  guests: number,
) {
  const rules = await getActivePricingRulesForStay(property.id, checkIn, checkOut);
  return quoteStay({
    property: toPricedProperty(property),
    checkIn,
    checkOut,
    guests,
    rules,
  });
}

const TRANSITIONS: Record<BookingStatus, BookingStatus[]> = {
  INQUIRY: ["RESERVED", "PAYMENT_PENDING", "CONFIRMED", "CANCELLED"],
  RESERVED: ["PAYMENT_PENDING", "CONFIRMED", "EXPIRED", "CANCELLED"],
  PAYMENT_PENDING: ["CONFIRMED", "EXPIRED", "CANCELLED"],
  CONFIRMED: ["CHECKED_IN", "CANCELLED"],
  CHECKED_IN: ["COMPLETED"],
  COMPLETED: [],
  CANCELLED: [],
  EXPIRED: [],
};

function assertTransition(from: BookingStatus, to: BookingStatus) {
  if (!TRANSITIONS[from].includes(to)) {
    throw new ValidationError(`Cannot change booking from ${from} to ${to}`);
  }
}

function newBookingReference() {
  const n = Math.floor(100000 + Math.random() * 900000);
  return `BK${n}`;
}

function validateStay(checkIn: string, checkOut: string, guests: number, maxGuests: number) {
  if (!isDateOnly(checkIn) || !isDateOnly(checkOut)) {
    throw new ValidationError("Dates must be YYYY-MM-DD");
  }
  if (nightsBetween(checkIn, checkOut) < 1) {
    throw new ValidationError("Check-out must be after check-in");
  }
  if (guests < 1 || guests > maxGuests) {
    throw new ValidationError(`Guests must be between 1 and ${maxGuests}`);
  }
}

export async function transitionBooking(
  bookingId: string,
  to: BookingStatus,
): Promise<Booking> {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw new NotFoundError("Booking not found");
  assertTransition(booking.status, to);
  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: to },
  });
  return updated;
}

export async function reserveDates(input: {
  guest: User;
  propertySlug: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
  paymentMethod: "RAZORPAY" | "DIRECT";
  idempotencyKey?: string;
}): Promise<Booking> {
  if (input.idempotencyKey) {
    const existing = await bookingRepository.findByIdempotencyKey(input.idempotencyKey);
    if (existing) return existing;
  }

  const property = await propertyRepository.findActiveBySlug(input.propertySlug);
  if (!property) throw new NotFoundError("Property not found");
  validateStay(input.checkIn, input.checkOut, input.guests, property.guests);

  const quote = await quotePropertyStay(property, input.checkIn, input.checkOut, input.guests);

  try {
    const booking = await prisma.$transaction(async (tx) => {
      await tx.booking.updateMany({
        where: {
          status: "RESERVED",
          reservationExpiresAt: { lte: new Date() },
        },
        data: { status: "EXPIRED" },
      });

      const available = await isRangeAvailable(property.id, input.checkIn, input.checkOut);
      if (!available) {
        throw new ConflictError("Those dates are no longer available");
      }

      const now = new Date();
      const expires = new Date(now.getTime() + RESERVATION_MINUTES * 60 * 1000);

      return tx.booking.create({
        data: {
          bookingReference: newBookingReference(),
          propertyId: property.id,
          guestId: input.guest.id,
          checkInDate: parseDateOnly(input.checkIn),
          checkOutDate: parseDateOnly(input.checkOut),
          numberOfGuests: input.guests,
          status: "RESERVED",
          source: "ONLINE",
          paymentMethod: input.paymentMethod,
          reservedAt: now,
          reservationExpiresAt: expires,
          pricingSnapshot: quote.snapshot as unknown as Prisma.InputJsonValue,
          specialRequests: input.specialRequests,
          idempotencyKey: input.idempotencyKey,
        },
      });
    });


    await postSystemMessage(
      booking.id,
      `Dates reserved for ${input.checkIn} – ${input.checkOut}. Complete payment within 15 minutes.`,
    );

    return booking;
  } catch (error) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("booking_no_overlap") || message.includes("exclusion")) {
      throw new ConflictError("Those dates are no longer available");
    }
    throw error;
  }
}

export async function createInquiry(input: {
  guest: User;
  propertySlug: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message: string;
}) {
  const property = await propertyRepository.findActiveBySlug(input.propertySlug);
  if (!property) throw new NotFoundError("Property not found");
  validateStay(input.checkIn, input.checkOut, input.guests, property.guests);

  const quote = await quotePropertyStay(property, input.checkIn, input.checkOut, input.guests);

  const result = await prisma.$transaction(async (tx) => {
    const booking = await tx.booking.create({
      data: {
        bookingReference: newBookingReference(),
        propertyId: property.id,
        guestId: input.guest.id,
        checkInDate: parseDateOnly(input.checkIn),
        checkOutDate: parseDateOnly(input.checkOut),
        numberOfGuests: input.guests,
        status: "INQUIRY",
        source: "INQUIRY",
        paymentMethod: "DIRECT",
        pricingSnapshot: quote.snapshot as unknown as Prisma.InputJsonValue,
        specialRequests: input.message,
      },
    });

    const conversation = await tx.conversation.create({
      data: {
        propertyId: property.id,
        bookingId: booking.id,
        guestId: input.guest.id,
        tags: ["booking_inquiry", "direct_payment"],
        messages: {
          create: [
            {
              kind: "SYSTEM",
              body: `Booking inquiry created for ${input.checkIn} – ${input.checkOut}`,
            },
            {
              senderUserId: input.guest.id,
              kind: "TEXT",
              body: input.message,
            },
          ],
        },
      },
    });

    return { booking, conversation };
  });


  await notifyInquiry(result.booking.id, input.message);

  return result;
}

export async function cancelBooking(input: { user: User; bookingReference: string }) {
  const booking = await bookingRepository.findByReference(input.bookingReference);
  if (!booking) throw new NotFoundError("Booking not found");
  if (input.user.role !== "ADMIN_HOST" && booking.guestId !== input.user.id) {
    throw new ForbiddenError();
  }
  return transitionBooking(booking.id, "CANCELLED");
}

export async function markPaymentPending(bookingId: string) {
  return transitionBooking(bookingId, "PAYMENT_PENDING");
}

export { expireReservations };
