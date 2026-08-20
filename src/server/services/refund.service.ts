import type { User } from "@prisma/client";
import prisma from "@/lib/prisma";
import { isRazorpayConfigured } from "@/lib/env";
import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from "@/server/errors";
import { createRazorpayRefund } from "@/server/integrations/razorpay/client";
import { requireDatabase } from "@/server/lib/require-config";

function refundableAmountPaise(payment: {
  amountPaise: number;
  status: string;
  refunds: { amountPaise: number; status: string }[];
}): number {
  if (payment.status !== "CAPTURED" && payment.status !== "PARTIALLY_REFUNDED") {
    return 0;
  }
  const refunded = payment.refunds
    .filter((refund) => refund.status === "PROCESSED" || refund.status === "PENDING")
    .reduce((sum, refund) => sum + refund.amountPaise, 0);
  return Math.max(0, payment.amountPaise - refunded);
}

export async function requestRefund(input: {
  admin: User;
  paymentId: string;
  amountPaise?: number;
  reason?: string;
}) {
  requireDatabase();
  if (input.admin.role !== "ADMIN_HOST") throw new ForbiddenError();

  const payment = await prisma.payment.findUnique({
    where: { id: input.paymentId },
    include: { refunds: true, booking: true },
  });
  if (!payment) throw new NotFoundError("Payment not found");

  const remaining = refundableAmountPaise(payment);
  if (remaining <= 0) {
    throw new ValidationError("This payment is not refundable");
  }

  const amountPaise = input.amountPaise ?? remaining;
  if (amountPaise <= 0 || amountPaise > remaining) {
    throw new ValidationError("Invalid refund amount");
  }

  const refund = await prisma.refund.create({
    data: {
      paymentId: payment.id,
      amountPaise,
      status: "PENDING",
      reason: input.reason,
    },
  });


  if (payment.provider === "razorpay") {
    if (!isRazorpayConfigured || !payment.providerPaymentId) {
      throw new ValidationError("Razorpay refund is not available for this payment");
    }

    const remote = await createRazorpayRefund({
      paymentId: payment.providerPaymentId,
      amountPaise,
      notes: {
        refundId: refund.id,
        bookingReference: payment.booking.bookingReference,
      },
    });

    await prisma.refund.update({
      where: { id: refund.id },
      data: { providerRefundId: String(remote.id) },
    });
  } else if (payment.provider === "direct") {
    await prisma.refund.update({
      where: { id: refund.id },
      data: { status: "PROCESSED", providerRefundId: `direct-${refund.id}` },
    });
    await syncPaymentRefundStatus(payment.id);
  } else {
    throw new ValidationError("Unsupported payment provider");
  }

  return prisma.refund.findUniqueOrThrow({ where: { id: refund.id } });
}

export async function syncPaymentRefundStatus(paymentId: string) {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: { refunds: true },
  });
  if (!payment) return;

  const processed = payment.refunds
    .filter((refund) => refund.status === "PROCESSED")
    .reduce((sum, refund) => sum + refund.amountPaise, 0);

  let status = payment.status;
  if (processed >= payment.amountPaise) {
    status = "REFUNDED";
  } else if (processed > 0) {
    status = "PARTIALLY_REFUNDED";
  }

  if (status !== payment.status) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status },
    });
  }
}

export async function handleRefundWebhook(input: {
  providerRefundId: string;
  providerPaymentId: string;
  amountPaise: number;
  status: "processed" | "failed";
}) {
  requireDatabase();

  let refund = await prisma.refund.findFirst({
    where: { providerRefundId: input.providerRefundId },
    include: { payment: true },
  });

  if (!refund) {
    const payment = await prisma.payment.findFirst({
      where: { providerPaymentId: input.providerPaymentId },
    });
    if (!payment) return null;

    refund = await prisma.refund.create({
      data: {
        paymentId: payment.id,
        amountPaise: input.amountPaise,
        status: "PENDING",
        providerRefundId: input.providerRefundId,
      },
      include: { payment: true },
    });
  }

  const nextStatus = input.status === "processed" ? "PROCESSED" : "FAILED";
  if (refund.status === nextStatus) return refund;

  const updated = await prisma.refund.update({
    where: { id: refund.id },
    data: { status: nextStatus },
    include: { payment: true },
  });

  if (nextStatus === "PROCESSED") {
    await syncPaymentRefundStatus(updated.paymentId);
  } else {
  }

  return updated;
}

/** Legacy helper — prefer requestRefund. */
export async function createRefundRecord(input: {
  paymentId: string;
  amountPaise: number;
  reason?: string;
  actorId?: string;
}) {
  const payment = await prisma.payment.findUnique({ where: { id: input.paymentId } });
  if (!payment) throw new NotFoundError("Payment not found");

  const refund = await prisma.refund.create({
    data: {
      paymentId: input.paymentId,
      amountPaise: input.amountPaise,
      status: "PENDING",
      reason: input.reason,
    },
  });


  return refund;
}
