import { z } from "zod";

export const cuidSchema = z.string().min(1);
export const emailSchema = z.string().trim().email("Invalid email");
export const dateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD");
export const nonEmptyString = z.string().trim().min(1);
export const optionalString = z.string().trim().optional().transform((v) => v || undefined);

export const paymentMethodSchema = z.enum(["online", "direct"]);

export function checkboxValue(value: unknown): boolean {
  return value === "on" || value === "true" || value === true;
}

export function formDataToObject(formData: FormData): Record<string, unknown> {
  const obj: Record<string, unknown> = {};
  for (const [key, value] of formData.entries()) {
    if (obj[key] !== undefined) {
      const existing = obj[key];
      obj[key] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

export const positiveInt = z.coerce.number().int().min(0);
export const positiveNumber = z.coerce.number().min(0);

export const latitudeSchema = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.coerce.number().min(-90).max(90).optional(),
);
export const longitudeSchema = z.preprocess(
  (v) => (v === "" || v == null ? undefined : v),
  z.coerce.number().min(-180).max(180).optional(),
);
