import type { Booking, BookingStatus, Payment, PaymentStatus, User } from "@prisma/client";
import type { GuestBookingDto, PricingSnapshot, UiBookingStatus, UiPaymentStatus } from "@/server/dto/public.dto";
import { formatDateOnly } from "@/server/lib/dates";
import { toPublicPropertyDto } from "@/server/mappers/property.mapper";
import type { PropertyWithRelations } from "@/server/repositories/property.repository";
import { snapshotToQuote } from "@/server/services/pricing.service";

const STATUS_MAP: Record<BookingStatus, UiBookingStatus> = {
  INQUIRY: "inquiry",
  RESERVED: "reserved",
  PAYMENT_PENDING: "payment_pending",
  CONFIRMED: "confirmed",
  CHECKED_IN: "checked_in",
  COMPLETED: "checked_out",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
};

const CONFIRMED_STATUSES: BookingStatus[] = ["CONFIRMED", "CHECKED_IN", "COMPLETED"];

function paymentUi(payments: Payment[], bookingStatus: BookingStatus): UiPaymentStatus {
  const latest = payments[0];
  if (latest) {
    const map: Record<PaymentStatus, UiPaymentStatus> = {
      PENDING: "pending",
      AUTHORIZED: "pending",
      CAPTURED: "paid",
      FAILED: "failed",
      REFUNDED: "refunded",
      PARTIALLY_REFUNDED: "partially_refunded",
    };
    return map[latest.status];
  }
  if (bookingStatus === "CONFIRMED" || bookingStatus === "CHECKED_IN" || bookingStatus === "COMPLETED") {
    return "paid";
  }
  if (bookingStatus === "EXPIRED") return "failed";
  return "pending";
}

export function parsePricingSnapshot(value: unknown): PricingSnapshot {
  return value as PricingSnapshot;
}

export function toGuestBookingDto(
  booking: Booking & {
    property: PropertyWithRelations;
    guest?: User;
    payments?: Payment[];
    conversation?: { id: string } | null;
    reviews?: { id: string }[];
  },
  options?: { includePrivateAccess?: boolean },
): GuestBookingDto {
  const snapshot = parsePricingSnapshot(booking.pricingSnapshot);
  const quote = snapshotToQuote(snapshot);
  const showPrivate =
    options?.includePrivateAccess && CONFIRMED_STATUSES.includes(booking.status);

  return {
    id: booking.bookingReference,
    propertyId: booking.propertyId,
    guestName: booking.guest?.name ?? "",
    guestEmail: booking.guest?.email ?? "",
    guestPhone: booking.guest?.phone ?? "",
    checkIn: formatDateOnly(booking.checkInDate),
    checkOut: formatDateOnly(booking.checkOutDate),
    guests: booking.numberOfGuests,
    amount: quote.totalRupees,
    paymentMethod: booking.paymentMethod === "DIRECT" ? "direct" : "razorpay",
    paymentStatus: paymentUi(booking.payments ?? [], booking.status),
    bookingStatus: STATUS_MAP[booking.status],
    specialRequests: booking.specialRequests ?? undefined,
    createdAt: booking.createdAt.toISOString().slice(0, 10),
    reservationExpiresAt: booking.reservationExpiresAt?.toISOString(),
    conversationId: booking.conversation?.id,
    canReview: booking.status === "COMPLETED" && !(booking.reviews?.length),
    hasReview: Boolean(booking.reviews?.length),
    arrivalInstructions: showPrivate ? booking.property.arrivalInstructions ?? undefined : undefined,
    accessInstructions: showPrivate ? booking.property.accessInstructions ?? undefined : undefined,
    parkingInstructions: showPrivate ? booking.property.parkingInstructions ?? undefined : undefined,
    property: toPublicPropertyDto(booking.property),
    quote,
  };
}
