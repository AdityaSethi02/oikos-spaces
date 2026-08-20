import { describe, expect, it } from "vitest";
import { verifyRazorpayCheckoutSignature } from "@/server/integrations/razorpay/signature";
import { createHmac } from "crypto";

describe("verifyRazorpayCheckoutSignature", () => {
  it("rejects invalid signatures", () => {
    const result = verifyRazorpayCheckoutSignature({
      orderId: "order_1",
      paymentId: "pay_1",
      signature: "bad",
      secret: "test_secret",
    });
    expect(result).toBe(false);
  });

  it("accepts valid HMAC", () => {
    const orderId = "order_test";
    const paymentId = "pay_test";
    const secret = "test_secret_key";
    const signature = createHmac("sha256", secret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    expect(
      verifyRazorpayCheckoutSignature({ orderId, paymentId, signature, secret }),
    ).toBe(true);
  });
});
