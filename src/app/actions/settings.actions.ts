"use server";

import { revalidatePath } from "next/cache";
import { actionFail, type ActionResult } from "@/server/schemas/action-result";
import { parseActionInput } from "@/server/schemas/parse-action";
import { saveIcalImportSchema } from "@/server/schemas/actions.schema";
import { requireAdminHost } from "@/server/policies/auth.policy";
import prisma from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/env";
import { saveIcalImportUrl } from "@/server/services/calendar-sync.service";

export async function saveHostSettingsAction(formData: FormData): Promise<ActionResult> {
  try {
    await requireAdminHost();
    if (!isDatabaseConfigured) {
      return { ok: false, error: "Unable to save settings" };
    }
    await prisma.hostSettings.upsert({
      where: { id: "default" },
      create: {
        id: "default",
        emailNotifications: formData.get("emailNotifications") === "on",
        whatsappAlerts: formData.get("whatsappAlerts") === "on",
        bookingReminders: formData.get("bookingReminders") === "on",
        whatsappNumber: String(formData.get("whatsappNumber") ?? "") || null,
        directPaymentInstructions: String(formData.get("directPaymentInstructions") ?? "") || null,
      },
      update: {
        emailNotifications: formData.get("emailNotifications") === "on",
        whatsappAlerts: formData.get("whatsappAlerts") === "on",
        bookingReminders: formData.get("bookingReminders") === "on",
        whatsappNumber: String(formData.get("whatsappNumber") ?? "") || null,
        directPaymentInstructions: String(formData.get("directPaymentInstructions") ?? "") || null,
      },
    });
    revalidatePath("/admin/settings");
    return { ok: true };
  } catch (error) {
    return actionFail(error);
  }
}

export async function saveIcalImportAction(formData: FormData): Promise<ActionResult> {
  try {
    const admin = await requireAdminHost();
    const parsed = parseActionInput(saveIcalImportSchema, {
      propertyId: formData.get("propertyId"),
      importUrl: formData.get("importUrl"),
    });
    await saveIcalImportUrl({
      admin,
      propertyId: parsed.propertyId,
      importUrl: parsed.importUrl,
    });
    revalidatePath("/admin/settings");
    return { ok: true };
  } catch (error) {
    return actionFail(error);
  }
}
