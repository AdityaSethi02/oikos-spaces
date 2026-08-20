"use server";

import { revalidatePath } from "next/cache";
import { actionFail, type ActionResult } from "@/server/schemas/action-result";
import { parseActionInput } from "@/server/schemas/parse-action";
import { moderateReviewSchema, submitReviewSchema } from "@/server/schemas/actions.schema";
import { requireAdminHost, requireAuthUserOrThrow } from "@/server/policies/auth.policy";
import { moderateReview, submitGuestReview } from "@/server/services/review.service";

export async function submitReviewAction(input: {
  bookingReference: string;
  rating: number;
  comment: string;
}): Promise<ActionResult> {
  try {
    const user = await requireAuthUserOrThrow();
    const parsed = parseActionInput(submitReviewSchema, input);
    await submitGuestReview({
      user,
      bookingReference: parsed.bookingReference,
      rating: parsed.rating,
      comment: parsed.comment,
    });
    revalidatePath(`/bookings/${parsed.bookingReference}`);
    revalidatePath("/admin/reviews");
    return { ok: true };
  } catch (error) {
    return actionFail(error);
  }
}

export async function moderateReviewAction(input: {
  reviewId: string;
  published?: boolean;
  response?: string;
}): Promise<ActionResult> {
  try {
    const admin = await requireAdminHost();
    const parsed = parseActionInput(moderateReviewSchema, input);
    await moderateReview({ admin, ...parsed });
    revalidatePath("/admin/reviews");
    revalidatePath("/stays");
    return { ok: true };
  } catch (error) {
    return actionFail(error);
  }
}
