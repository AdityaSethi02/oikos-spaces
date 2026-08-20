"use server";

import { revalidatePath } from "next/cache";
import { actionFail, type ActionResult } from "@/server/schemas/action-result";
import { parseActionInput } from "@/server/schemas/parse-action";
import {
  adminUpdateBookingStatusSchema,
  cancelBookingSchema,
  createInquirySchema,
  parseBlockDatesForm,
  reserveStaySchema,
  unblockDatesSchema,
} from "@/server/schemas/property.schema";
import { requireAdminHost, requireAuthUserOrThrow } from "@/server/policies/auth.policy";
import { createPropertyBlock } from "@/server/services/block.service";
import {
  cancelBooking,
  createInquiry,
  markPaymentPending,
  reserveDates,
  transitionBooking,
} from "@/server/services/booking.service";
import { postSystemMessage } from "@/server/services/chat.service";
import { recordCheckIn, recordCheckOut } from "@/server/services/checkin.service";
import { bookingRepository } from "@/server/repositories/booking.repository";
import { enforceRateLimit } from "@/server/lib/rate-limit";

export async function reserveStayAction(input: {
  slug: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
  paymentMethod: "online" | "direct";
}): Promise<ActionResult<{ bookingReference: string }>> {
  try {
    const guest = await requireAuthUserOrThrow();
    const parsed = parseActionInput(reserveStaySchema, input);
    await enforceRateLimit({ key: `booking:reserve:${guest.id}`, limit: 10, windowMs: 60 * 60_000 });
    const booking = await reserveDates({
      guest,
      propertySlug: parsed.slug,
      checkIn: parsed.checkIn,
      checkOut: parsed.checkOut,
      guests: parsed.guests,
      specialRequests: parsed.specialRequests,
      paymentMethod: parsed.paymentMethod === "direct" ? "DIRECT" : "RAZORPAY",
    });
    if (parsed.paymentMethod === "online") {
      await markPaymentPending(booking.id);
    }
    revalidatePath("/bookings");
    return { ok: true, bookingReference: booking.bookingReference };
  } catch (error) {
    return actionFail(error);
  }
}

export async function createInquiryAction(input: {
  slug: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  message: string;
}): Promise<ActionResult<{ bookingReference: string; conversationId: string }>> {
  try {
    const guest = await requireAuthUserOrThrow();
    const parsed = parseActionInput(createInquirySchema, input);
    await enforceRateLimit({ key: `booking:inquiry:${guest.id}`, limit: 10, windowMs: 60 * 60_000 });
    const result = await createInquiry({
      guest,
      propertySlug: parsed.slug,
      checkIn: parsed.checkIn,
      checkOut: parsed.checkOut,
      guests: parsed.guests,
      message: parsed.message,
    });
    revalidatePath("/bookings");
    return {
      ok: true,
      bookingReference: result.booking.bookingReference,
      conversationId: result.conversation.id,
    };
  } catch (error) {
    return actionFail(error);
  }
}

export async function cancelBookingAction(
  bookingReference: string,
): Promise<ActionResult> {
  try {
    const user = await requireAuthUserOrThrow();
    const parsed = parseActionInput(cancelBookingSchema, { bookingReference });
    await cancelBooking({ user, bookingReference: parsed.bookingReference });
    revalidatePath("/bookings");
    revalidatePath(`/bookings/${parsed.bookingReference}`);
    return { ok: true };
  } catch (error) {
    return actionFail(error);
  }
}

export async function adminUpdateBookingStatusAction(input: {
  bookingReference: string;
  status: "CHECKED_IN" | "COMPLETED" | "CANCELLED";
}): Promise<ActionResult> {
  try {
    await requireAdminHost();
    const parsed = parseActionInput(adminUpdateBookingStatusSchema, input);
    const booking = await bookingRepository.findByReference(parsed.bookingReference);
    if (!booking) {
      return { ok: false, error: "Booking not found" };
    }
    await transitionBooking(booking.id, parsed.status);
    if (parsed.status === "CHECKED_IN") await recordCheckIn(booking.id);
    if (parsed.status === "COMPLETED") await recordCheckOut(booking.id);
    const label =
      parsed.status === "CHECKED_IN"
        ? "Guest checked in."
        : parsed.status === "COMPLETED"
          ? "Guest checked out."
          : "Booking cancelled.";
    await postSystemMessage(booking.id, label);
    revalidatePath("/admin/bookings");
    revalidatePath("/bookings");
    return { ok: true };
  } catch (error) {
    return actionFail(error);
  }
}

export async function blockDatesAction(formData: FormData): Promise<ActionResult> {
  try {
    const admin = await requireAdminHost();
    const parsed = parseBlockDatesForm(formData);
    await createPropertyBlock({
      actorId: admin.id,
      propertyId: parsed.propertyId,
      start: parsed.start,
      end: parsed.end,
      reason: parsed.reason,
      notes: parsed.notes,
    });
    revalidatePath("/admin/calendar");
    revalidatePath("/admin/bookings");
    return { ok: true };
  } catch (error) {
    return actionFail(error);
  }
}

export async function unblockDatesAction(blockId: string): Promise<ActionResult> {
  try {
    const admin = await requireAdminHost();
    parseActionInput(unblockDatesSchema, { blockId });
    const { deletePropertyBlock } = await import("@/server/services/block.service");
    await deletePropertyBlock({ actorId: admin.id, blockId });
    revalidatePath("/admin/calendar");
    return { ok: true };
  } catch (error) {
    return actionFail(error);
  }
}
