import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  APP_URL: z.string().url().default("http://localhost:3000"),

  DATABASE_URL: z.string().min(1).optional(),
  DIRECT_URL: z.string().min(1).optional(),

  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: z.string().optional(),
  CLERK_SECRET_KEY: z.string().optional(),
  CLERK_WEBHOOK_SECRET: z.string().optional(),

  SEED_HOST_EMAIL: z.string().email().optional(),
  CRON_SECRET: z.string().optional(),

  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),

  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_PRIVATE: z.string().optional(),
  R2_BUCKET_PUBLIC: z.string().optional(),
  R2_PUBLIC_BASE_URL: z.string().optional(),

  NEXT_PUBLIC_SUPABASE_URL: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().optional(),
  WHATSAPP_API_KEY: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  MUX_TOKEN_ID: z.string().optional(),
  MUX_TOKEN_SECRET: z.string().optional(),
  MUX_WEBHOOK_SECRET: z.string().optional(),
  NEXT_PUBLIC_MUX_ENV_KEY: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

function parseEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    if (process.env.NODE_ENV === "production") {
      console.error("Invalid environment variables:", parsed.error.flatten().fieldErrors);
      throw new Error("Invalid environment configuration");
    }
    return envSchema.parse({
      NODE_ENV: process.env.NODE_ENV ?? "development",
      APP_URL: process.env.APP_URL ?? "http://localhost:3000",
    });
  }
  return parsed.data;
}

/** Validated env — safe for server-side use only */
export const env = parseEnv();

export const isDatabaseConfigured = Boolean(env.DATABASE_URL);
export const isClerkServerConfigured = Boolean(
  env.CLERK_SECRET_KEY && env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
);
export const isRazorpayConfigured = Boolean(
  env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET,
);
export const isR2Configured = Boolean(
  env.R2_ACCOUNT_ID &&
    env.R2_ACCESS_KEY_ID &&
    env.R2_SECRET_ACCESS_KEY &&
    env.R2_BUCKET_PRIVATE,
);
export const isPublicMediaConfigured = Boolean(
  isR2Configured && (env.R2_BUCKET_PUBLIC || env.R2_PUBLIC_BASE_URL),
);
export const isRealtimeConfigured = Boolean(
  env.NEXT_PUBLIC_SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY,
);
export const isResendConfigured = Boolean(env.RESEND_API_KEY);
export const isWhatsAppConfigured = Boolean(
  env.WHATSAPP_API_KEY && env.WHATSAPP_PHONE_NUMBER_ID,
);
export const isGoogleCalendarConfigured = Boolean(
  env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET,
);
export const isMuxConfigured = Boolean(env.MUX_TOKEN_ID && env.MUX_TOKEN_SECRET);
