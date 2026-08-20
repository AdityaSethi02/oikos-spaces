import { createHmac } from "crypto";
import { describe, expect, it } from "vitest";
import { verifyRazorpayWebhookSignature } from "./signature";

describe("razorpay webhook signature", () => {
  it("accepts a matching HMAC and rejects a mismatch", () => {
    const body = '{"event":"payment.captured"}';
    const secret = "whsec_test";
    const signature = createHmac("sha256", secret).update(body).digest("hex");
    expect(verifyRazorpayWebhookSignature(body, signature, secret)).toBe(true);
    expect(verifyRazorpayWebhookSignature(body, "aa".repeat(32), secret)).toBe(false);
  });
});
