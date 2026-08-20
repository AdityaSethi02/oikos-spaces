"use server";

import { actionFail, type ActionResult } from "@/server/schemas/action-result";
import { parseContactForm } from "@/server/schemas/actions.schema";
import { submitContactInquiry } from "@/server/services/contact.service";
import { enforceRateLimit } from "@/server/lib/rate-limit";

export async function submitContactAction(formData: FormData): Promise<ActionResult> {
  try {
    const input = parseContactForm(formData);
    await enforceRateLimit({ key: `contact:${input.email}`, limit: 5, windowMs: 60 * 60_000 });

    await submitContactInquiry(input);
    return { ok: true };
  } catch (error) {
    return actionFail(error);
  }
}
