import { isRazorpayConfigured } from "@/lib/env";
import {
  confirmOnlinePayment,
  recordWebhookEvent,
} from "@/server/services/payment.service";
import { handleRefundWebhook } from "@/server/services/refund.service";
import { verifyRazorpayWebhookSignature } from "@/server/integrations/razorpay/signature";

export const dynamic = "force-dynamic";

type RazorpayWebhook = {
  id?: string;
  event?: string;
  payload?: {
    payment?: { entity?: { id?: string; order_id?: string; status?: string } };
    refund?: {
      entity?: {
        id?: string;
        payment_id?: string;
        amount?: number;
        status?: string;
      };
    };
  };
};

export async function POST(req: Request) {
  if (!isRazorpayConfigured) {
    return new Response("Razorpay not configured", { status: 503 });
  }

  const signature = req.headers.get("x-razorpay-signature");
  const rawBody = await req.text();
  if (!signature || !verifyRazorpayWebhookSignature(rawBody, signature)) {
    return new Response("Invalid signature", { status: 400 });
  }

  let event: RazorpayWebhook;
  try {
    event = JSON.parse(rawBody) as RazorpayWebhook;
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const payment = event.payload?.payment?.entity;
  const eventId =
    event.id ??
    (payment?.id && event.event ? `${event.event}:${payment.id}` : undefined);
  if (!eventId) {
    return new Response("Missing event id", { status: 400 });
  }

  if (event.event === "payment.captured" || event.event === "order.paid") {
    if (payment?.order_id && payment.id) {
      try {
        await confirmOnlinePayment({
          orderId: payment.order_id,
          paymentId: payment.id,
          source: "webhook",
        });
      } catch (error) {
        console.error("[razorpay webhook]", error);
        return new Response("Handler failed", { status: 500 });
      }
    }
  }

  const refund = event.payload?.refund?.entity;
  if (
    refund?.id &&
    refund.payment_id &&
    (event.event === "refund.processed" || event.event === "refund.failed")
  ) {
    try {
      await handleRefundWebhook({
        providerRefundId: refund.id,
        providerPaymentId: refund.payment_id,
        amountPaise: Number(refund.amount ?? 0),
        status: event.event === "refund.processed" ? "processed" : "failed",
      });
    } catch (error) {
      console.error("[razorpay refund webhook]", error);
      return new Response("Refund handler failed", { status: 500 });
    }
  }

  await recordWebhookEvent({
    id: eventId,
    eventType: event.event ?? "unknown",
    payload: event,
  });

  return new Response("OK", { status: 200 });
}
