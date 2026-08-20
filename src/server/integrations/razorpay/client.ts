import Razorpay from "razorpay";
import { env, isRazorpayConfigured } from "@/lib/env";
import { ValidationError } from "@/server/errors";

export function getRazorpayClient(): Razorpay {
  if (!isRazorpayConfigured || !env.RAZORPAY_KEY_ID || !env.RAZORPAY_KEY_SECRET) {
    throw new ValidationError("Razorpay is not configured");
  }
  return new Razorpay({
    key_id: env.RAZORPAY_KEY_ID,
    key_secret: env.RAZORPAY_KEY_SECRET,
  });
}

export function getRazorpayPublicKey(): string {
  return env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? env.RAZORPAY_KEY_ID ?? "";
}

export async function fetchRazorpayPayment(paymentId: string) {
  const client = getRazorpayClient();
  return client.payments.fetch(paymentId);
}

export async function createRazorpayRefund(input: {
  paymentId: string;
  amountPaise: number;
  notes?: Record<string, string>;
}) {
  const client = getRazorpayClient();
  return client.payments.refund(input.paymentId, {
    amount: input.amountPaise,
    notes: input.notes,
  });
}
