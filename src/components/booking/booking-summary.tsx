"use client";

import Link from "next/link";
import { PropertyThumbnail } from "@/components/media/property-thumbnail";
import { PriceBreakdown } from "@/components/booking/price-breakdown";
import { Card } from "@/components/ui/card";
import type { Property } from "@/server/dto/domain.dto";
import type { QuoteDto } from "@/server/dto/public.dto";
import { calculateNights, formatCurrency, formatDateRange } from "@/lib/utils";
import { useState } from "react";

interface BookingSummaryProps {
  property: Property;
  checkIn: string;
  checkOut: string;
  guests: number;
  quote?: QuoteDto | null;
  showProperty?: boolean;
  collapsible?: boolean;
}

export function BookingSummary({
  property,
  checkIn,
  checkOut,
  guests,
  quote,
  showProperty = true,
  collapsible = false,
}: BookingSummaryProps) {
  const nights = calculateNights(checkIn, checkOut);
  const [open, setOpen] = useState(!collapsible);

  return (
    <Card>
      {collapsible && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="flex w-full items-center justify-between text-left lg:hidden"
          aria-expanded={open}
        >
          <span className="font-medium">Your stay</span>
          <span className="text-sm text-muted">
            {formatCurrency(quote?.totalRupees ?? property.pricePerNight * nights)} · {open ? "Hide" : "Show"}
          </span>
        </button>
      )}

      <div className={collapsible ? (open ? "mt-4 block" : "hidden lg:block") : ""}>
        {showProperty && (
          <div className="flex gap-4">
            <div className="relative w-24 shrink-0 aspect-square overflow-hidden rounded-lg">
              <PropertyThumbnail property={property} className="absolute inset-0 rounded-lg" sizes="96px" />
            </div>
            <div>
              <Link
                href={`/stays/${property.slug}`}
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
        </div>

        <div className="mt-5">
          <PriceBreakdown
            snapshot={quote?.snapshot}
            pricePerNight={quote?.averageNightlyRupees ?? property.pricePerNight}
            nights={nights}
            cleaningFee={quote?.cleaningFeeRupees ?? property.cleaningFee}
            serviceFee={quote?.serviceFeeRupees ?? 0}
            taxes={quote?.taxRupees ?? 0}
            total={quote?.totalRupees}
          />
        </div>
      </div>
    </Card>
  );
}
