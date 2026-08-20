import { buildHouseRules } from "@/lib/house-rules";
import { z } from "zod";
import {
  checkboxValue,
  cuidSchema,
  dateOnlySchema,
  formDataToObject,
  latitudeSchema,
  longitudeSchema,
  nonEmptyString,
  optionalString,
  paymentMethodSchema,
  positiveInt,
  positiveNumber,
} from "@/server/schemas/common";

export const reserveStaySchema = z.object({
  slug: nonEmptyString,
  checkIn: dateOnlySchema,
  checkOut: dateOnlySchema,
  guests: z.coerce.number().int().min(1).max(50),
  specialRequests: optionalString,
  paymentMethod: paymentMethodSchema,
});

export const createInquirySchema = z.object({
  slug: nonEmptyString,
  checkIn: dateOnlySchema,
  checkOut: dateOnlySchema,
  guests: z.coerce.number().int().min(1).max(50),
  message: nonEmptyString.max(2000),
});

export const cancelBookingSchema = z.object({
  bookingReference: nonEmptyString,
});

export const adminUpdateBookingStatusSchema = z.object({
  bookingReference: nonEmptyString,
  status: z.enum(["CHECKED_IN", "COMPLETED", "CANCELLED"]),
});

export const blockDatesSchema = z.object({
  propertyId: cuidSchema,
  start: dateOnlySchema,
  end: dateOnlySchema,
  reason: z.enum(["PERSONAL_USE", "MAINTENANCE", "EXTERNAL_BOOKING", "OTHER"]),
  notes: optionalString,
});

export const unblockDatesSchema = z.object({
  blockId: cuidSchema,
});

export function parseBlockDatesForm(formData: FormData) {
  return blockDatesSchema.parse(formDataToObject(formData));
}

export const updatePropertyFormSchema = z
  .object({
    id: cuidSchema,
    name: nonEmptyString,
    location: nonEmptyString,
    address: nonEmptyString,
    type: nonEmptyString,
    about: nonEmptyString,
    guests: positiveInt.min(1),
    bedrooms: positiveInt.min(1),
    beds: positiveInt.min(1),
    bathrooms: positiveInt.min(1),
    basePriceRupees: positiveNumber,
    weekendPriceRupees: positiveNumber,
    cleaningFeeRupees: positiveNumber,
    amenities: z.array(z.string()).default([]),
    checkInTime: nonEmptyString,
    checkOutTime: nonEmptyString,
    cancellationPolicyText: z.string(),
    quietHours: optionalString,
    allowSmoking: z.preprocess(checkboxValue, z.boolean()).default(false),
    allowPets: z.preprocess(checkboxValue, z.boolean()).default(false),
    allowParties: z.preprocess(checkboxValue, z.boolean()).default(false),
    customHouseRules: optionalString,
    arrivalInstructions: optionalString,
    accessInstructions: optionalString,
    parkingInstructions: optionalString,
    contactPhone: optionalString,
    latitude: latitudeSchema,
    longitude: longitudeSchema,
  })
  .transform((data) => ({
    ...data,
    houseRules: buildHouseRules(data),
  }));

export function parseUpdatePropertyForm(formData: FormData) {
  const raw = formDataToObject(formData);
  const amenities = formData.getAll("amenities").map(String);
  return updatePropertyFormSchema.parse({ ...raw, amenities });
}

export const createPropertyFormSchema = z.object({
  name: nonEmptyString,
  slug: optionalString,
  tagline: optionalString,
  description: nonEmptyString,
  location: nonEmptyString,
  address: nonEmptyString,
  type: nonEmptyString.default("Apartment"),
  guests: positiveInt.min(1).default(2),
  bedrooms: positiveInt.min(1).default(1),
  beds: positiveInt.min(1).default(1),
  bathrooms: positiveInt.min(1).default(1),
  basePriceRupees: positiveNumber,
  weekendPriceRupees: positiveNumber.optional(),
  cleaningFeeRupees: positiveNumber.optional(),
  amenities: z.array(z.string()).default([]),
});

export function parseCreatePropertyForm(formData: FormData) {
  const raw = formDataToObject(formData);
  return createPropertyFormSchema.parse({
    ...raw,
    amenities: formData.getAll("amenities").map(String),
  });
}

export const setPropertyStatusSchema = z.object({
  id: cuidSchema,
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const mediaUploadStartSchema = z.object({
  propertyId: cuidSchema,
  fileName: nonEmptyString,
  mimeType: nonEmptyString,
  sizeBytes: z.coerce.number().int().positive(),
  kind: z.enum(["PHOTO", "VIDEO"]),
});

export const setFeaturedMediaSchema = z.object({
  propertyId: cuidSchema,
  mediaId: cuidSchema,
});

export const createPricingRuleSchema = z.object({
  propertyId: cuidSchema,
  startDate: dateOnlySchema,
  endDate: dateOnlySchema,
  nightlyPriceRupees: positiveNumber,
  weekendPriceRupees: positiveNumber.optional(),
}).refine((data) => data.endDate >= data.startDate, {
  message: "End date must be on or after start date",
  path: ["endDate"],
});

export const updatePricingRuleSchema = createPricingRuleSchema.extend({
  id: cuidSchema,
  isActive: z.boolean().optional(),
});

export const deletePricingRuleSchema = z.object({
  id: cuidSchema,
  propertyId: cuidSchema,
});
