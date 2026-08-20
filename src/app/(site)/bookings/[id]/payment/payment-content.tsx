"use client";

import Script from "next/script";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookingSummary } from "@/components/booking/booking-summary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { GuestBookingDto } from "@/server/dto/public.dto";
import { useToast } from "@/components/providers/toast-provider";
import { ErrorState } from "@/components/feedback/empty-state";
import { formatCurrency } from "@/lib/utils";
import { Icons } from "@/components/icons";
import type { IconType } from "react-icons";
import {
  createRazorpayOrderAction,
  verifyRazorpayCheckoutAction,
} from "@/app/actions/payment.actions";

const paymentMethods: { id: string; label: string; icon: IconType }[] = [
  { id: "upi", label: "UPI", icon: Icons.Smartphone },
  { id: "qr", label: "QR Code", icon: Icons.QrCode },
  { id: "card", label: "Credit / Debit Card", icon: Icons.CreditCard },
  { id: "netbanking", label: "Net Banking", icon: Icons.Landmark },
];

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

export default function PaymentContent({ booking }: { booking: GuestBookingDto }) {
  const router = useRouter();
  const { showToast } = useToast();

  const property = booking.property;
  const total = booking.quote.totalRupees;

  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [failed, setFailed] = useState(false);

  const handlePay = async () => {
    setProcessing(true);
    setFailed(false);
    const order = await createRazorpayOrderAction(booking.id);
    if (!order.ok) {
      setProcessing(false);
      setFailed(true);
      showToast(order.error, "error");
      return;
    }
    if (!window.Razorpay) {
      setProcessing(false);
      showToast("Payment widget failed to load. Refresh and try again.", "error");
      return;
    }

    const checkout = new window.Razorpay({
      key: order.keyId,
      amount: order.amountPaise,
      currency: order.currency,
      name: "OIKOS SPACES",
      description: `Booking ${booking.id}`,
      order_id: order.orderId,
      prefill: {
        name: booking.guestName,
        email: booking.guestEmail,
        contact: booking.guestPhone,
      },
      theme: { color: "#A67C52" },
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        const verified = await verifyRazorpayCheckoutAction({
          bookingReference: booking.id,
          orderId: response.razorpay_order_id,
          paymentId: response.razorpay_payment_id,
          signature: response.razorpay_signature,
        });
        setProcessing(false);
        if (!verified.ok) {
          setFailed(true);
          showToast(verified.error, "error");
          return;
        }
        showToast("Payment received — confirming your booking…", "success");
        router.push(`/bookings/confirmation?id=${booking.id}`);
      },
      modal: {
        ondismiss: () => setProcessing(false),
      },
    });
    checkout.open();
  };

  return (
    <div className="section-padding">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      <div className="container-page">
        <h1 className="font-serif text-3xl">Payment</h1>
        {failed && (
          <div className="mt-6">
            <ErrorState
              title="Payment failed"
              description="The payment did not go through. You can try again — confirmation happens only after Razorpay verifies the payment."
              onRetry={() => setFailed(false)}
            />
          </div>
        )}
        <p className="mt-2 flex items-center gap-2 text-sm text-muted">
          <Icons.Lock className="h-4 w-4" aria-hidden />
          Secure payment via Razorpay · UPI, cards, and net banking
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <Card>
              <h2 className="font-serif text-xl">Payment method</h2>
              <p className="mt-2 text-sm text-muted">
                Choose a preferred method. Razorpay Checkout collects the details securely.
              </p>
              <div className="mt-6 space-y-3">
                {paymentMethods.map((pm) => {
                  const Icon = pm.icon;
                  return (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setMethod(pm.id)}
                    className={`flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-colors ${
                      method === pm.id
                        ? "border-foreground bg-background"
                        : "border-border hover:border-foreground/30"
                    }`}
                  >
                    <span className="text-accent" aria-hidden="true">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="font-medium">{pm.label}</span>
                  </button>
                  );
                })}
              </div>
            </Card>

            <Button
              size="lg"
              fullWidth
              onClick={handlePay}
              disabled={processing}
            >
              {processing ? "Processing…" : `Pay ${formatCurrency(total)}`}
            </Button>
          </div>

          <BookingSummary
            property={property}
            checkIn={booking.checkIn}
            checkOut={booking.checkOut}
            guests={booking.guests}
            quote={booking.quote}
          />
        </div>
      </div>
    </div>
  );
}
