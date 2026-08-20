import { isRazorpayConfigured } from "@/lib/env";
import { ConflictError, ForbiddenError, NotFoundError, ValidationError } from "@/server/errors";
import {
  fetchRazorpayPayment,
  getRazorpayClient,
  getRazorpayPublicKey,
} from "@/server/integrations/razorpay/client";
import { parsePricingSnapshot } from "@/server/mappers/booking.mapper";
import prisma from "@/lib/prisma";
import { bookingRepository } from "@/server/repositories/booking.repository";
import { isRangeAvailable } from "@/server/services/availability.service";
import { transitionBooking } from "@/server/services/booking.service";
import { postSystemMessage } from "@/server/services/chat.service";
import { notifyBookingConfirmed } from "@/server/services/checkin.service";
import { formatDateOnly } from "@/server/lib/dates";
import type { User } from "@prisma/client";

export async function createPaymentOrder(input: {
  user: User;
  bookingReference: string;
}) {
  if (!isRazorpayConfigured) {
    throw new ValidationError("Online payment is not configured yet");
  }

  const booking = await bookingRepository.findByReference(input.bookingReference);
  if (!booking) throw new NotFoundError("Booking not found");
  if (booking.guestId !== input.user.id) {
    throw new ForbiddenError();
  }
  if (booking.status !== "PAYMENT_PENDING" && booking.status !== "RESERVED") {
    throw new ValidationError("This booking is not awaiting payment");
  }

  const snapshot = parsePricingSnapshot(booking.pricingSnapshot);
  const existing = booking.payments.find(
    (payment) => payment.status === "PENDING" && payment.providerOrderId,
  );
  if (existing?.providerOrderId) {
    return {
      orderId: existing.providerOrderId,
      amountPaise: existing.amountPaise,
      currency: existing.currency,
      keyId: getRazorpayPublicKey(),
      bookingReference: booking.bookingReference,
    };
  }

  const client = getRazorpayClient();
  const order = await client.orders.create({
    amount: snapshot.totalPaise,
    currency: "INR",
    receipt: booking.bookingReference,
    notes: {
      bookingId: booking.id,
      bookingReference: booking.bookingReference,
      guestId: booking.guestId,
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: booking.id,
      provider: "razorpay",
      providerOrderId: order.id,
      amountPaise: snapshot.totalPaise,
      currency: "INR",
      status: "PENDING",
      metadata: { receipt: booking.bookingReference, guestId: booking.guestId },
    },
  });


  return {
    orderId: order.id,
    amountPaise: snapshot.totalPaise,
    currency: "INR",
    keyId: getRazorpayPublicKey(),
    bookingReference: booking.bookingReference,
  };
}

async function verifyPaymentAmount(input: {
  paymentId: string;
  expectedPaise: number;
  orderId: string;
}) {
  const remote = await fetchRazorpayPayment(input.paymentId);
  const amount = Number(remote.amount);
  const currency = String(remote.currency);
  const orderId = String(remote.order_id);
  const status = String(remote.status);

  if (currency !== "INR") {
    throw new ValidationError("Unexpected payment currency");
  }
  if (orderId !== input.orderId) {
    throw new ValidationError("Payment order mismatch");
  }
  if (amount !== input.expectedPaise) {
    throw new ValidationError("Payment amount mismatch");
  }
  if (status !== "captured" && status !== "authorized") {
    throw new ValidationError("Payment not captured");
  }
}

export async function confirmOnlinePayment(input: {
  orderId: string;
  paymentId: string;
  source: "webhook" | "checkout";
  guestId?: string;
}) {
  const payment = await prisma.payment.findUnique({
    where: { providerOrderId: input.orderId },
    include: { booking: true },
  });
  if (!payment) throw new NotFoundError("Payment not found");

  if (input.guestId && payment.booking.guestId !== input.guestId) {
    throw new ForbiddenError();
  }

  const snapshot = parsePricingSnapshot(payment.booking.pricingSnapshot);
  await verifyPaymentAmount({
    paymentId: input.paymentId,
    expectedPaise: snapshot.totalPaise,
    orderId: input.orderId,
  });

  if (payment.status === "CAPTURED") {
    if (
      payment.booking.status === "PAYMENT_PENDING" ||
      payment.booking.status === "RESERVED"
    ) {
      await transitionBooking(payment.booking.id, "CONFIRMED");
    }
    return payment;
  }

  if (
    payment.booking.status === "EXPIRED" ||
    payment.booking.status === "CANCELLED"
  ) {
    throw new ConflictError("Booking is no longer active");
  }

  const claimed = await prisma.payment.updateMany({
    where: { id: payment.id, status: { not: "CAPTURED" } },
    data: {
      providerPaymentId: input.paymentId,
      status: "CAPTURED",
      capturedAt: new Date(),
    },
  });

  const booking = await prisma.booking.findUnique({ where: { id: payment.bookingId } });
  if (
    booking &&
    (booking.status === "PAYMENT_PENDING" || booking.status === "RESERVED")
  ) {
    await transitionBooking(booking.id, "CONFIRMED");
  }

  if (claimed.count > 0) {
    await postSystemMessage(
      payment.booking.id,
      "Online payment received. Your booking is confirmed.",
    );
    await notifyBookingConfirmed(payment.booking.id);
  }

  return prisma.payment.findUniqueOrThrow({ where: { id: payment.id } });
}

export async function confirmDirectBooking(input: {
  admin: User;
  bookingReference: string;
}) {
  const booking = await bookingRepository.findByReference(input.bookingReference);
  if (!booking) throw new NotFoundError("Booking not found");
  if (booking.status === "CONFIRMED" || booking.status === "CHECKED_IN" || booking.status === "COMPLETED") {
    return booking;
  }
  if (booking.paymentMethod !== "DIRECT" && booking.source !== "INQUIRY") {
    throw new ValidationError("This booking is not a direct payment");
  }

  const available = await isRangeAvailable(
    booking.propertyId,
    formatDateOnly(booking.checkInDate),
    formatDateOnly(booking.checkOutDate),
    booking.id,
  );
  if (!available) {
    throw new ConflictError("Those dates are no longer available");
  }

  const snapshot = parsePricingSnapshot(booking.pricingSnapshot);
  const alreadyPaid = booking.payments.some(
    (payment) => payment.provider === "direct" && payment.status === "CAPTURED",
  );
  if (!alreadyPaid) {
    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        provider: "direct",
        amountPaise: snapshot.totalPaise,
        currency: "INR",
        status: "CAPTURED",
        capturedAt: new Date(),
        metadata: { confirmedBy: input.admin.id },
      },
    });
  }

  if (booking.status === "INQUIRY") {
    await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "PAYMENT_PENDING", paymentMethod: "DIRECT" },
    });
  }

  const confirmed = await transitionBooking(booking.id, "CONFIRMED");

  await postSystemMessage(
    booking.id,
    "Host confirmed direct payment. Your booking is confirmed.",
  );
  await notifyBookingConfirmed(booking.id);


  return confirmed;
}

export async function recordWebhookEvent(input: {
  id: string;
  eventType: string;
  payload: unknown;
}): Promise<boolean> {
  try {
    await prisma.paymentWebhookEvent.create({
      data: {
        id: input.id,
        eventType: input.eventType,
        payload: input.payload as object,
      },
    });
    return true;
  } catch {
    return false;
  }
}

export async function listAdminPayments() {
  const payments = await prisma.payment.findMany({
    include: {
      booking: {
        include: {
          guest: true,
          property: true,
        },
      },
      refunds: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const inquiries = await prisma.booking.findMany({
    where: {
      paymentMethod: "DIRECT",
      status: { in: ["INQUIRY", "PAYMENT_PENDING"] },
      payments: { none: {} },
    },
    include: { guest: true, property: true },
    orderBy: { createdAt: "desc" },
  });

  const inquiryRows = inquiries.map((booking) => {
    const snapshot = booking.pricingSnapshot as { totalPaise?: number };
    return {
      id: `inquiry-${booking.id}`,
      paymentId: null as string | null,
      bookingId: booking.bookingReference,
      guestName: booking.guest.name ?? booking.guest.email,
      propertyName: booking.property.name,
      amount: Math.round((snapshot.totalPaise ?? 0) / 100),
      method: "direct",
      status: "pending",
      date: booking.createdAt.toISOString().slice(0, 10),
      refundable: false,
      providerPaymentId: null as string | null,
    };
  });

  return [
    ...inquiryRows,
    ...payments.map((payment) => {
      const processedRefunds = payment.refunds
        .filter((refund) => refund.status === "PROCESSED" || refund.status === "PENDING")
        .reduce((sum, refund) => sum + refund.amountPaise, 0);
      const refundable =
        (payment.status === "CAPTURED" || payment.status === "PARTIALLY_REFUNDED") &&
        processedRefunds < payment.amountPaise;

      return {
        id: payment.id,
        paymentId: payment.id,
        bookingId: payment.booking.bookingReference,
        guestName: payment.booking.guest.name ?? payment.booking.guest.email,
        propertyName: payment.booking.property.name,
        amount: Math.round(payment.amountPaise / 100),
        method: payment.provider === "direct" ? "direct" : "razorpay",
        status:
          payment.status === "CAPTURED"
            ? "paid"
            : payment.status === "FAILED"
              ? "failed"
              : payment.status === "REFUNDED"
                ? "refunded"
                : payment.status === "PARTIALLY_REFUNDED"
                  ? "partially_refunded"
                  : "pending",
        date: payment.createdAt.toISOString().slice(0, 10),
        refundable,
        providerPaymentId: payment.providerPaymentId,
      };
    }),
  ];
}
