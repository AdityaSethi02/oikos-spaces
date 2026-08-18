"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriceBreakdown } from "@/components/booking/price-breakdown";
import { DatePicker } from "@/components/calendar/date-picker";
import { GuestSelector } from "@/components/booking/guest-selector";
import { EmptyState } from "@/components/feedback/empty-state";
import type { Property } from "@/data/mock/properties";
import { calculateNights, formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface BookingCardProps {
  property: Property;
  sticky?: boolean;
  className?: string;
}

export function BookingCard({ property, sticky = true, className }: BookingCardProps) {
  const [checkIn, setCheckIn] = useState("2026-09-15");
  const [checkOut, setCheckOut] = useState("2026-09-18");
  const [guests, setGuests] = useState(2);
  const [showCalendar, setShowCalendar] = useState(true);

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const noDates = Boolean(checkIn && !checkOut);

  return (
    <Card
      className={cn(
        sticky && "lg:sticky lg:top-24",
        className,
      )}
    >
      <div className="flex items-baseline justify-between">
        <p>
          <span className="font-serif text-2xl font-medium">
            {formatCurrency(property.pricePerNight)}
          </span>
          <span className="text-muted"> / night</span>
        </p>
      </div>

      <div className="mt-5 space-y-3">
        <button
          type="button"
          onClick={() => setShowCalendar(!showCalendar)}
          className="w-full rounded-lg border border-border p-3 text-left transition-colors hover:border-foreground/30"
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-medium text-muted">Check-in</p>
              <p className="mt-0.5 text-sm">{checkIn || "Add date"}</p>
            </div>
            <div>
              <p className="text-xs font-medium text-muted">Check-out</p>
              <p className="mt-0.5 text-sm">{checkOut || "Add date"}</p>
            </div>
          </div>
        </button>

        {showCalendar && (
          <DatePicker
            checkIn={checkIn}
            checkOut={checkOut}
            onSelect={(inDate, outDate) => {
              setCheckIn(inDate);
              setCheckOut(outDate);
            }}
          />
        )}

        <GuestSelector value={guests} onChange={setGuests} max={property.guests} />
      </div>

      {noDates && (
        <EmptyState
          className="mt-5 py-8"
          title="Select check-out"
          description="Choose an available check-out date to see pricing."
        />
      )}

      {nights > 0 && (
        <div className="mt-5">
          <PriceBreakdown
            pricePerNight={property.pricePerNight}
            nights={nights}
            cleaningFee={property.cleaningFee}
          />
        </div>
      )}

      <Link
        href={`/login?next=${encodeURIComponent(`/stays/${property.slug}/book?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}`}
        className="mt-5 block"
      >
        <Button fullWidth disabled={!checkIn || !checkOut}>Check availability</Button>
      </Link>

      <Link
        href={`/stays/${property.slug}/contact-host?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`}
        className="mt-3 block"
      >
        <Button variant="outline" fullWidth>
          Contact host
        </Button>
      </Link>

      <p className="mt-4 text-center text-xs text-muted">
        You won&apos;t be charged yet
      </p>
    </Card>
  );
}

export function MobileBookingBar({ property, slug }: { property: Property; slug: string }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-border bg-surface/95 p-4 backdrop-blur-sm lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-semibold text-foreground">
            {formatCurrency(property.pricePerNight)}
            <span className="text-sm font-normal text-muted"> / night</span>
          </p>
          <p className="text-xs text-muted">You won&apos;t be charged yet</p>
        </div>
        <Link href={`/stays/${slug}/availability`}>
          <Button>Check availability</Button>
        </Link>
      </div>
    </div>
  );
}
