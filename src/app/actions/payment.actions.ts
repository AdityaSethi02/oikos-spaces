"use server";

import { revalidatePath } from "next/cache";
import { actionFail } from "@/server/schemas/action-result";
import { parseActionInput } from "@/server/schemas/parse-action";
import {
  createRazorpayOrderSchema,
  razorpayCheckoutSchema,
  requestRefundSchema,
  sendChatMessageSchema,
} from "@/server/schemas/actions.schema";
import { requireAdminHost, requireAuthUserOrThrow } from "@/server/policies/auth.policy";
import {
  completeDocumentUpload,
  createDocumentUpload,
  getAdminDocumentViewUrl,
} from "@/server/services/document.service";
import {
  confirmDirectBooking,
  createPaymentOrder,
} from "@/server/services/payment.service";
import { requestRefund } from "@/server/services/refund.service";
import { verifyRazorpayCheckoutSignature } from "@/server/integrations/razorpay/signature";
import {
  listMessagesPage,
  markConversationRead,
  requestGuestId,
  sendBookingInfo,
  sendMessage,
  getConversationForUser,
} from "@/server/services/chat.service";
import prisma from "@/lib/prisma";
import { enforceRateLimit } from "@/server/lib/rate-limit";

export async function createRazorpayOrderAction(bookingReference: string) {
  try {
    const user = await requireAuthUserOrThrow();
    const parsed = parseActionInput(createRazorpayOrderSchema, { bookingReference });
    await enforceRateLimit({ key: `payment:order:${user.id}`, limit: 20, windowMs: 60 * 60_000 });
    const order = await createPaymentOrder({ user, bookingReference: parsed.bookingReference });
    return { ok: true as const, ...order };
  } catch (error) {
    return actionFail(error);
  }
}

export async function verifyRazorpayCheckoutAction(input: {
  bookingReference: string;
  orderId: string;
  paymentId: string;
  signature: string;
}) {
  try {
    const user = await requireAuthUserOrThrow();
    const parsed = parseActionInput(razorpayCheckoutSchema, input);
    if (!verifyRazorpayCheckoutSignature(parsed)) {
      return { ok: false as const, error: "Invalid payment signature", code: "FORBIDDEN" };
    }

    const payment = await prisma.payment.findUnique({
      where: { providerOrderId: parsed.orderId },
      include: { booking: true },
    });
    if (!payment) {
      return { ok: false as const, error: "Payment not found" };
    }
    if (payment.booking.guestId !== user.id) {
      return { ok: false as const, error: "Access denied", code: "FORBIDDEN" };
    }
    if (payment.booking.bookingReference !== parsed.bookingReference) {
      return { ok: false as const, error: "Booking mismatch", code: "FORBIDDEN" };
    }

    return {
      ok: true as const,
      pendingConfirmation: true,
      bookingReference: parsed.bookingReference,
    };
  } catch (error) {
    return actionFail(error);
  }
}

export async function confirmDirectPaymentAction(bookingReference: string) {
  try {
    const admin = await requireAdminHost();
    await confirmDirectBooking({ admin, bookingReference });
    revalidatePath("/admin/payments");
    revalidatePath("/admin/bookings");
    revalidatePath("/admin/messages");
    revalidatePath("/bookings");
    return { ok: true as const };
  } catch (error) {
    return actionFail(error);
  }
}

export async function requestRefundAction(input: {
  paymentId: string;
  amountPaise?: number;
  reason?: string;
}) {
  try {
    const admin = await requireAdminHost();
    const parsed = parseActionInput(requestRefundSchema, input);
    await requestRefund({
      admin,
      paymentId: parsed.paymentId,
      amountPaise: parsed.amountPaise,
      reason: parsed.reason,
    });
    revalidatePath("/admin/payments");
    return { ok: true as const };
  } catch (error) {
    return actionFail(error);
  }
}

export async function sendChatMessageAction(input: {
  conversationId: string;
  body: string;
}) {
  try {
    const user = await requireAuthUserOrThrow();
    const parsed = parseActionInput(sendChatMessageSchema, input);
    await enforceRateLimit({
      key: `chat:send:${user.id}:${parsed.conversationId}`,
      limit: 60,
      windowMs: 60_000,
    });
    const message = await sendMessage({
      user,
      conversationId: parsed.conversationId,
      body: parsed.body,
    });
    return { ok: true as const, message };
  } catch (error) {
    return actionFail(error);
  }
}

export async function loadMessagesAction(conversationId: string) {
  try {
    const user = await requireAuthUserOrThrow();
    const page = await listMessagesPage({ user, conversationId });
    await markConversationRead(user, conversationId);
    return { ok: true as const, ...page };
  } catch (error) {
    return actionFail(error);
  }
}

export async function loadOlderMessagesAction(input: {
  conversationId: string;
  cursor: string;
}) {
  try {
    const user = await requireAuthUserOrThrow();
    const page = await listMessagesPage({
      user,
      conversationId: input.conversationId,
      cursor: input.cursor,
    });
    return { ok: true as const, ...page };
  } catch (error) {
    return actionFail(error);
  }
}

export async function markChatReadAction(conversationId: string) {
  try {
    const user = await requireAuthUserOrThrow();
    await markConversationRead(user, conversationId);
    return { ok: true as const };
  } catch (error) {
    return actionFail(error);
  }
}

export async function startDocumentUploadAction(input: {
  bookingReference: string;
  conversationId?: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
}) {
  try {
    const user = await requireAuthUserOrThrow();
    const result = await createDocumentUpload({ user, ...input });
    return { ok: true as const, ...result };
  } catch (error) {
    return actionFail(error);
  }
}

export async function finishDocumentUploadAction(documentId: string) {
  try {
    const user = await requireAuthUserOrThrow();
    await completeDocumentUpload({ user, documentId });
    return { ok: true as const };
  } catch (error) {
    return actionFail(error);
  }
}

export async function viewDocumentAction(documentId: string) {
  try {
    const admin = await requireAdminHost();
    const url = await getAdminDocumentViewUrl({ admin, documentId });
    return { ok: true as const, url };
  } catch (error) {
    return actionFail(error);
  }
}

export async function requestGuestIdAction(conversationId: string) {
  try {
    const admin = await requireAdminHost();
    await requestGuestId(admin, conversationId);
    revalidatePath("/admin/messages");
    return { ok: true as const };
  } catch (error) {
    return actionFail(error);
  }
}

export async function sendBookingInfoAction(conversationId: string) {
  try {
    const admin = await requireAdminHost();
    const message = await sendBookingInfo(admin, conversationId);
    return { ok: true as const, message };
  } catch (error) {
    return actionFail(error);
  }
}

export async function confirmDirectFromConversationAction(conversationId: string) {
  try {
    const admin = await requireAdminHost();
    const conversation = await getConversationForUser(admin, conversationId);
    if (!conversation.bookingId) {
      return { ok: false as const, error: "This conversation is not linked to a booking" };
    }
    const booking = await prisma.booking.findUnique({ where: { id: conversation.bookingId } });
    if (!booking) {
      return { ok: false as const, error: "Booking not found" };
    }
    await confirmDirectBooking({ admin, bookingReference: booking.bookingReference });
    revalidatePath("/admin/payments");
    revalidatePath("/admin/bookings");
    revalidatePath("/admin/messages");
    return { ok: true as const };
  } catch (error) {
    return actionFail(error);
  }
}
