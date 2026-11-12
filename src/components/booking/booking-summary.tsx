"use client";

import Link from "next/link";
import { PropertyImage } from "@/components/media/property-image";
import { PriceBreakdown } from "@/components/booking/price-breakdown";
import { Card } from "@/components/ui/card";
import type { Property } from "@/data/mock/properties";
import { calculateNights, formatDateRange } from "@/lib/utils";
import { useState } from "react";

interface BookingSummaryProps {
  property: Property;
  checkIn: string;
  checkOut: string;
  guests: number;
  showProperty?: boolean;
  collapsible?: boolean;
}

/** Legacy stay booking summary — kept for demo booking routes. */
export function BookingSummary({
  property,
  checkIn,
  checkOut,
  guests,
  showProperty = true,
  collapsible = false,
}: BookingSummaryProps) {
  const nights = calculateNights(checkIn, checkOut);
  const [open, setOpen] = useState(!collapsible);
  // Approximate nightly rate from listing price for legacy booking demos
  const nightly = Math.max(1_000, Math.round(property.price / 30));

  return (
    <Card>
      {collapsible && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between text-left lg:hidden"
          aria-expanded={open}
        >
          <span className="font-medium">Summary</span>
          <span className="text-sm text-muted">
            {property.priceLabel} · {open ? "Hide" : "Show"}
          </span>
        </button>
      )}

      <div className={collapsible ? (open ? "mt-4 block" : "hidden lg:block") : ""}>
        {showProperty && (
          <div className="flex gap-4">
            <div className="aspect-square w-24 shrink-0 overflow-hidden rounded-lg">
              <PropertyImage
                src={property.coverImage}
                alt={property.name}
                className="rounded-lg"
              />
            </div>
            <div>
              <Link
                href={`/properties/${property.slug}`}
                className="font-serif text-lg hover:text-accent"
              >
                {property.name}
              </Link>
              <p className="mt-1 text-sm text-muted">{property.location}</p>
            </div>
          </div>
        )}

        <div className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">Dates</span>
            <span>{formatDateRange(checkIn, checkOut)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Guests</span>
            <span>{guests}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Nights</span>
            <span>{nights}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Listed at</span>
            <span>{property.priceLabel}</span>
          </div>
        </div>

        <div className="mt-5">
          <PriceBreakdown pricePerNight={nightly} nights={nights} cleaningFee={800} />
        </div>
      </div>
    </Card>
  );
}
