"use client";

import { useEffect, useState } from "react";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PriceBreakdown } from "@/components/booking/price-breakdown";
import { DatePicker } from "@/components/calendar/date-picker";
import { GuestSelector } from "@/components/booking/guest-selector";
import { EmptyState } from "@/components/feedback/empty-state";
import type { Property } from "@/server/dto/domain.dto";
import type { QuoteDto } from "@/server/dto/public.dto";
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
  const [unavailableDates, setUnavailableDates] = useState<string[]>([]);
  const [quote, setQuote] = useState<QuoteDto | null>(null);

  const nights = checkIn && checkOut ? calculateNights(checkIn, checkOut) : 0;
  const hasCompleteDates = Boolean(checkIn && checkOut);
  const displayQuote = hasCompleteDates ? quote : null;
  const bookHref = `/sign-in?next=${encodeURIComponent(`/stays/${property.slug}/book?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`)}`;
  const contactHref = `/stays/${property.slug}/contact-host?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}`;

  useEffect(() => {
    fetch(`/api/properties/${property.slug}/availability`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { unavailableDates?: string[] } | null) => {
        if (data?.unavailableDates) setUnavailableDates(data.unavailableDates);
      })
      .catch(() => undefined);
  }, [property.slug]);

  useEffect(() => {
    if (!hasCompleteDates) return;
    const params = new URLSearchParams({ checkIn, checkOut, guests: String(guests) });
    fetch(`/api/properties/${property.slug}/quote?${params}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: QuoteDto | null) => setQuote(data))
      .catch(() => setQuote(null));
  }, [property.slug, checkIn, checkOut, guests, hasCompleteDates]);

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
            unavailableDates={unavailableDates}
            onSelect={(inDate, outDate) => {
              setCheckIn(inDate);
              setCheckOut(outDate);
            }}
          />
        )}

        <GuestSelector value={guests} onChange={setGuests} max={property.guests} />
      </div>

      {checkIn && !checkOut && (
        <EmptyState
          className="mt-5 py-8"
          title="Select check-out"
          description="Choose an available check-out date to see pricing."
        />
      )}

      {nights > 0 && (
        <div className="mt-5">
          <PriceBreakdown
            snapshot={displayQuote?.snapshot}
            pricePerNight={displayQuote?.averageNightlyRupees ?? property.pricePerNight}
            nights={nights}
            cleaningFee={displayQuote?.cleaningFeeRupees ?? property.cleaningFee}
            serviceFee={displayQuote?.serviceFeeRupees ?? 0}
            taxes={displayQuote?.taxRupees ?? 0}
            total={displayQuote?.totalRupees}
          />
        </div>
      )}

      <ButtonLink href={bookHref} fullWidth className="mt-5" disabled={!checkIn || !checkOut}>
        Check availability
      </ButtonLink>

      <ButtonLink href={contactHref} variant="outline" fullWidth className="mt-3">
        Contact host
      </ButtonLink>

      <p className="mt-4 text-center text-xs text-muted">
        You won&apos;t be charged yet
      </p>
    </Card>
  );
}

export function MobileBookingBar({ property, slug }: { property: Property; slug: string }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-surface/95 px-4 py-3 backdrop-blur-sm pb-[max(0.75rem,env(safe-area-inset-bottom))] lg:hidden">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="font-semibold text-foreground">
            {formatCurrency(property.pricePerNight)}
            <span className="text-sm font-normal text-muted"> / night</span>
          </p>
          <p className="text-xs text-muted">You won&apos;t be charged yet</p>
        </div>
        <ButtonLink href={`/stays/${slug}/availability`} className="shrink-0">
          Check availability
        </ButtonLink>
      </div>
    </div>
  );
}
