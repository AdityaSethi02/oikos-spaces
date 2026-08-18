"use client";

import Link from "next/link";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import { BookingSummary } from "@/components/booking/booking-summary";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getPropertyBySlug } from "@/data/mock/properties";
import { useToast } from "@/components/providers/toast-provider";
import { Icons } from "@/components/icons";

export default function BookContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showToast } = useToast();
  const slug = params.slug as string;
  const property = getPropertyBySlug(slug);

  const checkIn = searchParams.get("checkIn") || "2026-09-15";
  const checkOut = searchParams.get("checkOut") || "2026-09-18";
  const guests = Number(searchParams.get("guests") || 2);

  const [paymentMethod, setPaymentMethod] = useState<"online" | "direct">("online");

  if (!property) {
    return (
      <div className="container-page section-padding">
        <p className="text-muted">This stay could not be found.</p>
        <Link href="/stays" className="mt-4 inline-block text-accent hover:underline">
          Browse stays
        </Link>
      </div>
    );
  }

  const handleContinue = () => {
    if (paymentMethod === "online") {
      router.push(
        `/bookings/BK123456/payment?property=${slug}&checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`,
      );
    } else {
      router.push(
        `/stays/${slug}/contact-host?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`,
      );
    }
    showToast("Proceeding to next step (demo)", "info");
  };

  return (
    <div className="section-padding">
      <div className="container-page">
        <nav className="text-sm text-muted">
          <Link href={`/stays/${slug}`} className="hover:text-foreground">
            ← Back to {property.name}
          </Link>
        </nav>

        <h1 className="mt-4 font-serif text-3xl">Complete your booking</h1>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-8">
            <Card>
              <h2 className="font-serif text-xl">Guest details</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Input label="Full name" placeholder="Your name" defaultValue="Guest User" />
                <Input label="Email" type="email" placeholder="you@example.com" defaultValue="guest@example.com" />
                <Input label="Phone" type="tel" placeholder="+91" defaultValue="+91 98765 00000" />
                <Input label="Number of guests" type="number" defaultValue={String(guests)} />
              </div>
              <div className="mt-4">
                <Textarea label="Special requests" placeholder="Any special requests or questions…" />
              </div>
            </Card>

            <Card>
              <h2 className="font-serif text-xl">Payment method</h2>
              <div className="mt-6 space-y-3">
                <PaymentOption
                  selected={paymentMethod === "online"}
                  onSelect={() => setPaymentMethod("online")}
                  title="Pay online"
                  description="Secure payment via UPI, card, or net banking"
                  icon={Icons.CreditCard}
                  iconsLabel="UPI · Visa · Mastercard"
                />
                <PaymentOption
                  selected={paymentMethod === "direct"}
                  onSelect={() => setPaymentMethod("direct")}
                  title="Contact host / Pay directly"
                  description="Arrange payment via UPI or bank transfer with the host"
                  icon={Icons.Smartphone}
                  iconsLabel="UPI · Bank Transfer"
                />
              </div>
            </Card>

            <Button size="lg" fullWidth onClick={handleContinue} className="lg:hidden">
              Continue
            </Button>
          </div>

          <div className="space-y-6">
            <BookingSummary
              property={property}
              checkIn={checkIn}
              checkOut={checkOut}
              guests={guests}
              collapsible
            />
            <Button size="lg" fullWidth onClick={handleContinue} className="hidden lg:flex">
              Continue to payment
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function PaymentOption({
  selected,
  onSelect,
  title,
  description,
  icon: Icon,
  iconsLabel,
}: {
  selected: boolean;
  onSelect: () => void;
  title: string;
  description: string;
  icon: typeof Icons.CreditCard;
  iconsLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border p-4 text-left transition-colors ${
        selected ? "border-foreground bg-background" : "border-border hover:border-foreground/30"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
            selected ? "border-foreground bg-foreground text-background" : "border-muted"
          }`}
        >
          {selected && <Icons.Check className="h-3 w-3" />}
        </span>
        <div className="min-w-0">
          <p className="font-medium">{title}</p>
          <p className="mt-1 text-sm text-muted">{description}</p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {iconsLabel}
          </p>
        </div>
      </div>
    </button>
  );
}
