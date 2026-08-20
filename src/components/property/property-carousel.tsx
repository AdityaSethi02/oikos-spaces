"use client";

import { PropertyCard } from "@/components/property/property-card";
import type { Property } from "@/server/dto/domain.dto";

interface PropertyCarouselProps {
  properties: Property[];
  showPrice?: boolean;
}

export function PropertyCarousel({
  properties,
  showPrice = false,
}: PropertyCarouselProps) {
  return (
    <>
      {/* Mobile: horizontal snap carousel */}
      <div className="mt-10 -mx-4 sm:mx-0 sm:hidden">
        <div
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Property carousel"
        >
          {properties.map((property) => (
            <div
              key={property.id}
              className="w-[85vw] max-w-[320px] shrink-0 snap-center"
            >
              <PropertyCard
                property={property}
                showPrice={showPrice}
                className="h-full"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: grid */}
      <div className="mt-10 hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            showPrice={showPrice}
          />
        ))}
      </div>
    </>
  );
}
