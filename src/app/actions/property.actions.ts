"use server";

import { revalidatePath } from "next/cache";
import { actionFail, type ActionResult } from "@/server/schemas/action-result";
import { parseActionInput } from "@/server/schemas/parse-action";
import {
  mediaUploadStartSchema,
  parseCreatePropertyForm,
  parseUpdatePropertyForm,
  setFeaturedMediaSchema,
  setPropertyStatusSchema,
} from "@/server/schemas/property.schema";
import { requireAdminHost } from "@/server/policies/auth.policy";
import {
  createPropertyFromAdmin,
  getAdminPropertyById,
  setPropertyStatus,
  updatePropertyFromAdmin,
} from "@/server/services/property.service";
import {
  completePropertyMediaUpload,
  deletePropertyMedia,
  setFeaturedMedia,
  startPropertyMediaUpload,
} from "@/server/services/media.service";
import { enforceRateLimit } from "@/server/lib/rate-limit";

export async function createPropertyAction(
  formData: FormData,
): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    const admin = await requireAdminHost();
    await enforceRateLimit({ key: `admin:property:${admin.id}`, limit: 20, windowMs: 60_000 });

    const input = parseCreatePropertyForm(formData);
    const property = await createPropertyFromAdmin({
      actorId: admin.id,
      name: input.name,
      slug: input.slug,
      tagline: input.tagline,
      description: input.description,
      location: input.location,
      address: input.address,
      type: input.type,
      guests: input.guests,
      bedrooms: input.bedrooms,
      beds: input.beds,
      bathrooms: input.bathrooms,
      basePriceRupees: input.basePriceRupees,
      weekendPriceRupees: input.weekendPriceRupees,
      cleaningFeeRupees: input.cleaningFeeRupees,
      amenities: input.amenities,
    });

    revalidatePath("/admin/properties");
    revalidatePath("/stays");
    return { ok: true, id: property.id, slug: property.slug };
  } catch (error) {
    return actionFail(error);
  }
}

export async function updatePropertyAction(formData: FormData): Promise<ActionResult> {
  try {
    const admin = await requireAdminHost();
    const input = parseUpdatePropertyForm(formData);

    await updatePropertyFromAdmin({
      id: input.id,
      actorId: admin.id,
      name: input.name,
      location: input.location,
      address: input.address,
      type: input.type,
      about: input.about,
      guests: input.guests,
      bedrooms: input.bedrooms,
      beds: input.beds,
      bathrooms: input.bathrooms,
      basePriceRupees: input.basePriceRupees,
      weekendPriceRupees: input.weekendPriceRupees,
      cleaningFeeRupees: input.cleaningFeeRupees,
      amenities: input.amenities,
      checkInTime: input.checkInTime,
      checkOutTime: input.checkOutTime,
      cancellationPolicyText: input.cancellationPolicyText,
      houseRules: input.houseRules,
      arrivalInstructions: input.arrivalInstructions,
      accessInstructions: input.accessInstructions,
      parkingInstructions: input.parkingInstructions,
      contactPhone: input.contactPhone,
      latitude: input.latitude,
      longitude: input.longitude,
    });

    revalidatePath("/admin/properties");
    revalidatePath(`/admin/properties/${input.id}`);
    revalidatePath("/stays");
    revalidatePath(`/stays/${input.id}`);
    return { ok: true };
  } catch (error) {
    return actionFail(error);
  }
}

export async function setPropertyStatusAction(input: {
  id: string;
  status: "ACTIVE" | "INACTIVE";
}): Promise<ActionResult> {
  try {
    const admin = await requireAdminHost();
    const parsed = parseActionInput(setPropertyStatusSchema, input);
    await setPropertyStatus({ id: parsed.id, actorId: admin.id, status: parsed.status });
    revalidatePath("/admin/properties");
    revalidatePath("/stays");
    return { ok: true };
  } catch (error) {
    return actionFail(error);
  }
}

export async function startMediaUploadAction(input: {
  propertyId: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  kind: "PHOTO" | "VIDEO";
}) {
  try {
    const admin = await requireAdminHost();
    const parsed = parseActionInput(mediaUploadStartSchema, input);
    const result = await startPropertyMediaUpload({ admin, ...parsed });
    return { ok: true as const, ...result };
  } catch (error) {
    return actionFail(error);
  }
}

export async function finishMediaUploadAction(mediaId: string): Promise<ActionResult> {
  try {
    const admin = await requireAdminHost();
    await completePropertyMediaUpload({ admin, mediaId });
    revalidatePath("/admin/properties");
    revalidatePath("/stays");
    return { ok: true };
  } catch (error) {
    return actionFail(error);
  }
}

export async function deleteMediaAction(mediaId: string): Promise<ActionResult> {
  try {
    const admin = await requireAdminHost();
    await deletePropertyMedia({ admin, mediaId });
    revalidatePath("/admin/properties");
    revalidatePath("/stays");
    return { ok: true };
  } catch (error) {
    return actionFail(error);
  }
}

export async function setFeaturedMediaAction(input: {
  propertyId: string;
  mediaId: string;
}): Promise<ActionResult> {
  try {
    const admin = await requireAdminHost();
    const parsed = parseActionInput(setFeaturedMediaSchema, input);
    await setFeaturedMedia({ admin, ...parsed });
    revalidatePath("/admin/properties");
    revalidatePath("/stays");
    return { ok: true };
  } catch (error) {
    return actionFail(error);
  }
}

export async function getAdminPropertyAction(id: string) {
  try {
    await requireAdminHost();
    const property = await getAdminPropertyById(id);
    if (!property) return { ok: false as const, error: "Property not found" };
    return { ok: true as const, property };
  } catch (error) {
    return actionFail(error);
  }
}