"use server";

import { revalidatePath } from "next/cache";
import { actionFail, type ActionResult } from "@/server/schemas/action-result";
import { parseActionInput } from "@/server/schemas/parse-action";
import {
  createPricingRuleSchema,
  deletePricingRuleSchema,
} from "@/server/schemas/property.schema";
import { requireAdminHost } from "@/server/policies/auth.policy";
import {
  createPricingRule,
  deletePricingRule,
  togglePricingRule,
} from "@/server/services/pricing-rule.service";
import { z } from "zod";

const toggleSchema = z.object({
  id: z.string().min(1),
  propertyId: z.string().min(1),
  isActive: z.boolean(),
});

export async function createPricingRuleAction(formData: FormData): Promise<ActionResult> {
  try {
    const admin = await requireAdminHost();
    const input = parseActionInput(createPricingRuleSchema, {
      propertyId: formData.get("propertyId"),
      startDate: formData.get("startDate"),
      endDate: formData.get("endDate"),
      nightlyPriceRupees: formData.get("nightlyPriceRupees"),
      weekendPriceRupees: formData.get("weekendPriceRupees") || undefined,
    });

    await createPricingRule({
      actorId: admin.id,
      propertyId: input.propertyId,
      startDate: input.startDate,
      endDate: input.endDate,
      nightlyPriceRupees: input.nightlyPriceRupees,
      weekendPriceRupees: input.weekendPriceRupees,
    });

    revalidatePath(`/admin/properties/${input.propertyId}`);
    revalidatePath("/stays");
    return { ok: true };
  } catch (error) {
    return actionFail(error);
  }
}

export async function deletePricingRuleAction(input: {
  id: string;
  propertyId: string;
}): Promise<ActionResult> {
  try {
    const admin = await requireAdminHost();
    const parsed = parseActionInput(deletePricingRuleSchema, input);
    await deletePricingRule({ actorId: admin.id, ...parsed });
    revalidatePath(`/admin/properties/${parsed.propertyId}`);
    revalidatePath("/stays");
    return { ok: true };
  } catch (error) {
    return actionFail(error);
  }
}

export async function togglePricingRuleAction(input: {
  id: string;
  propertyId: string;
  isActive: boolean;
}): Promise<ActionResult> {
  try {
    const admin = await requireAdminHost();
    const parsed = parseActionInput(toggleSchema, input);
    await togglePricingRule({ actorId: admin.id, ...parsed });
    revalidatePath(`/admin/properties/${parsed.propertyId}`);
    revalidatePath("/stays");
    return { ok: true };
  } catch (error) {
    return actionFail(error);
  }
}
