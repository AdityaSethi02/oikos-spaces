import { z } from "zod";
import { emailSchema, formDataToObject, nonEmptyString, optionalString } from "@/server/schemas/common";

export const contactFormSchema = z.object({
  name: nonEmptyString.max(120),
  email: emailSchema,
  phone: optionalString,
  message: nonEmptyString.max(4000),
});

export function parseContactForm(formData: FormData) {
  return contactFormSchema.parse(formDataToObject(formData));
}

export const addAdminHostSchema = z.object({
  email: emailSchema,
  name: optionalString,
});

export const hostAccountIdSchema = z.object({
  hostAccountId: z.string().min(1),
});

export const favoritePropertySchema = z.object({
  propertyId: z.string().min(1),
});

export const submitReviewSchema = z.object({
  bookingReference: nonEmptyString,
  rating: z.coerce.number().int().min(1).max(5),
  comment: nonEmptyString.max(2000),
});

export const moderateReviewSchema = z.object({
  reviewId: z.string().min(1),
  published: z.boolean().optional(),
  response: optionalString,
});

export const saveIcalImportSchema = z.object({
  propertyId: z.string().min(1),
  importUrl: z.string().url("Enter a valid URL"),
});

export const razorpayCheckoutSchema = z.object({
  bookingReference: nonEmptyString,
  orderId: nonEmptyString,
  paymentId: nonEmptyString,
  signature: nonEmptyString,
});

export const sendChatMessageSchema = z.object({
  conversationId: z.string().min(1),
  body: nonEmptyString.max(4000),
});

export const confirmDirectPaymentSchema = z.object({
  paymentId: z.string().min(1),
});

export const createRazorpayOrderSchema = z.object({
  bookingReference: nonEmptyString,
});

export const requestRefundSchema = z.object({
  paymentId: z.string().min(1),
  amountPaise: z.coerce.number().int().positive().optional(),
  reason: optionalString,
});
