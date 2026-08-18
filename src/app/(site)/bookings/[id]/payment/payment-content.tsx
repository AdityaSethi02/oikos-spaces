"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { BookingSummary } from "@/components/booking/booking-summary";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPropertyBySlug } from "@/data/mock/properties";
import { useToast } from "@/components/providers/toast-provider";
import { ErrorState } from "@/components/feedback/empty-state";
import { formatCurrency, calculateBookingTotal, calculateNights } from "@/lib/utils";

const paymentMethods = [
  { id: "upi", label: "UPI", icon: "📱" },
  { id: "qr", label: "QR Code", icon: "📷" },
  { id: "card", label: "Credit / Debit Card", icon: "💳" },
  { id: "netbanking", label: "Net Banking", icon: "🏦" },
];

export default function PaymentContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();

  const slug = searchParams.get("property") || "the-boho-nook";
  const property = getPropertyBySlug(slug);
  const checkIn = searchParams.get("checkIn") || "2026-09-15";
  const checkOut = searchParams.get("checkOut") || "2026-09-18";
  const guests = Number(searchParams.get("guests") || 2);

  const [method, setMethod] = useState("upi");
  const [processing, setProcessing] = useState(false);
  const [failed, setFailed] = useState(searchParams.get("failed") === "1");

  if (!property) {
    return (
      <div className="container-page section-padding text-center">
        <p>Property not found</p>
      </div>
    );
  }

  const nights = calculateNights(checkIn, checkOut);
  const { total } = calculateBookingTotal(
    property.pricePerNight,
    nights,
    property.cleaningFee,
  );

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      if (method === "netbanking") {
        setFailed(true);
        showToast("Payment failed (demo)", "error");
        return;
      }
      showToast("Payment successful (demo)!", "success");
      router.push(`/bookings/confirmation?id=${params.id}`);
    }, 1200);
  };

  return (
    <div className="section-padding">
      <div className="container-page">
        <h1 className="font-serif text-3xl">Payment</h1>
        {failed && (
          <div className="mt-6">
            <ErrorState
              title="Payment failed"
              description="The demo payment did not go through. Try another method — Razorpay will replace this later."
              onRetry={() => setFailed(false)}
            />
          </div>
        )}
        <p className="mt-2 flex items-center gap-2 text-sm text-muted">
          🔒 Secure payment · Razorpay integration coming soon
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <Card>
              <h2 className="font-serif text-xl">Payment method</h2>
              <div className="mt-6 space-y-3">
                {paymentMethods.map((pm) => (
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
                    <span className="text-xl" aria-hidden="true">{pm.icon}</span>
                    <span className="font-medium">{pm.label}</span>
                  </button>
                ))}
              </div>
            </Card>

            {method === "upi" && (
              <Card>
                <label htmlFor="upi-id" className="text-sm text-muted">Enter UPI ID (demo)</label>
                <input
                  id="upi-id"
                  className="search-input mt-3"
                  placeholder="yourname@upi"
                  defaultValue="guest@upi"
                />
              </Card>
            )}

            {method === "card" && (
              <Card>
                <div className="space-y-4">
                  <input className="search-input" placeholder="Card number" defaultValue="4111 1111 1111 1111" aria-label="Card number" />
                  <div className="grid grid-cols-2 gap-4">
                    <input className="search-input" placeholder="MM/YY" defaultValue="12/28" aria-label="Expiry date" />
                    <input className="search-input" placeholder="CVV" defaultValue="123" aria-label="CVV" />
                  </div>
                </div>
              </Card>
            )}

            {method === "qr" && (
              <Card className="flex flex-col items-center py-8">
                <div className="flex h-48 w-48 items-center justify-center rounded-xl border-2 border-dashed border-border bg-background text-sm text-muted">
                  QR Code Placeholder
                </div>
                <p className="mt-4 text-sm text-muted">Scan with any UPI app</p>
              </Card>
            )}

            {method === "netbanking" && (
              <Card>
                <label htmlFor="bank" className="text-sm text-muted">Select bank (demo)</label>
                <select id="bank" className="search-input mt-3">
                  <option>HDFC Bank</option>
                  <option>ICICI Bank</option>
                  <option>SBI</option>
                  <option>Axis Bank</option>
                </select>
              </Card>
            )}

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
            checkIn={checkIn}
            checkOut={checkOut}
            guests={guests}
          />
        </div>
      </div>
    </div>
  );
}
