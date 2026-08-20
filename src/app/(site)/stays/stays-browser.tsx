"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PropertyCard } from "@/components/property/property-card";
import { SearchWidget } from "@/components/booking/search-widget";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { Icons } from "@/components/icons";
import type { Property, PropertyType } from "@/server/dto/domain.dto";

export function StaysBrowser({
  properties,
  availableIds,
  hasDateFilter,
}: {
  properties: Property[];
  availableIds?: string[];
  hasDateFilter?: boolean;
}) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(20000);
  const [minGuests, setMinGuests] = useState(1);
  const [minBedrooms, setMinBedrooms] = useState(0);
  const [minBathrooms, setMinBathrooms] = useState(0);
  const [types, setTypes] = useState<PropertyType[]>(["Apartment", "Villa", "Heritage Home"]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(Boolean(hasDateFilter));

  const filtered = useMemo(
    () =>
      properties.filter((p) => {
        if (p.pricePerNight > maxPrice) return false;
        if (p.guests < minGuests) return false;
        if (minBedrooms > 0 && p.bedrooms < minBedrooms) return false;
        if (minBathrooms > 0 && p.bathrooms < minBathrooms) return false;
        if (!types.includes(p.type)) return false;
        if (amenities.length && !amenities.every((a) => p.amenities.includes(a as never))) return false;
        if (availableOnly && availableIds && !availableIds.includes(p.id)) return false;
        return true;
      }),
    [properties, maxPrice, minGuests, minBedrooms, minBathrooms, types, amenities, availableOnly, availableIds],
  );

  const filterProps = {
    maxPrice,
    setMaxPrice,
    minGuests,
    setMinGuests,
    minBedrooms,
    setMinBedrooms,
    minBathrooms,
    setMinBathrooms,
    types,
    setTypes,
    amenities,
    setAmenities,
    availableOnly,
    setAvailableOnly,
  };

  return (
    <div className="section-padding">
      <div className="container-page">
        <nav className="text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Stays</span>
        </nav>
        <div className="mb-8 mt-4">
          <h1 className="font-serif text-3xl sm:text-4xl">Our Stays</h1>
          <p className="mt-2 text-muted">
            Discover our collection of boutique homes in Udaipur.
          </p>
        </div>

        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-start">
          <div className="flex-1">
            <SearchWidget variant="inline" />
          </div>
          <Button
            variant="outline"
            onClick={() => setFiltersOpen(true)}
            className="shrink-0 lg:hidden"
          >
            <Icons.Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <div className="flex gap-8">
          <aside className="hidden w-64 shrink-0 lg:block">
            <FilterPanel {...filterProps} />
          </aside>

          <div className="min-w-0 flex-1 space-y-6">
            <p className="text-sm text-muted">
              {filtered.length} propert{filtered.length !== 1 ? "ies" : "y"} available
            </p>
            {filtered.length === 0 ? (
              <EmptyState
                title="No stays match these filters"
                description="Try adjusting dates, guests, or amenities."
                actionLabel="Reset filters"
                onAction={() => {
                  setMaxPrice(20000);
                  setMinGuests(1);
                  setMinBedrooms(0);
                  setMinBathrooms(0);
                  setTypes(["Apartment", "Villa", "Heritage Home"]);
                  setAmenities([]);
                  setAvailableOnly(false);
                }}
              />
            ) : (
              filtered.map((property) => (
                <div key={property.id}>
                  <div className="hidden sm:block">
                    <PropertyCard property={property} layout="horizontal" />
                  </div>
                  <div className="sm:hidden">
                    <PropertyCard property={property} layout="vertical" />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Drawer open={filtersOpen} onClose={() => setFiltersOpen(false)} title="Filters">
        <div className="p-4">
          <FilterPanel {...filterProps} />
          <Button fullWidth className="mt-6" onClick={() => setFiltersOpen(false)}>
            Apply filters
          </Button>
        </div>
      </Drawer>
    </div>
  );
}

function FilterPanel({
  maxPrice,
  setMaxPrice,
  minGuests,
  setMinGuests,
  minBedrooms,
  setMinBedrooms,
  minBathrooms,
  setMinBathrooms,
  types,
  setTypes,
  amenities,
  setAmenities,
  availableOnly,
  setAvailableOnly,
}: {
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  minGuests: number;
  setMinGuests: (v: number) => void;
  minBedrooms: number;
  setMinBedrooms: (v: number) => void;
  minBathrooms: number;
  setMinBathrooms: (v: number) => void;
  types: PropertyType[];
  setTypes: (v: PropertyType[]) => void;
  amenities: string[];
  setAmenities: (v: string[]) => void;
  availableOnly: boolean;
  setAvailableOnly: (v: boolean) => void;
}) {
  const toggleType = (t: PropertyType) => {
    setTypes(types.includes(t) ? types.filter((x) => x !== t) : [...types, t]);
  };
  const toggleAmenity = (a: string) => {
    setAmenities(amenities.includes(a) ? amenities.filter((x) => x !== a) : [...amenities, a]);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium" htmlFor="max-price">Max price per night</label>
        <input
          id="max-price"
          type="range"
          min={3000}
          max={20000}
          step={500}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="mt-2 w-full"
        />
        <p className="mt-1 text-sm text-muted">Up to ₹{maxPrice.toLocaleString("en-IN")}</p>
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="min-guests">Guests</label>
        <select id="min-guests" value={minGuests} onChange={(e) => setMinGuests(Number(e.target.value))} className="search-input mt-2">
          {[1, 2, 4, 6, 8].map((n) => (
            <option key={n} value={n}>{n}+ guests</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="min-beds">Bedrooms</label>
        <select id="min-beds" value={minBedrooms} onChange={(e) => setMinBedrooms(Number(e.target.value))} className="search-input mt-2">
          {[0, 1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>{n === 0 ? "Any" : `${n}+`}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="min-baths">Bathrooms</label>
        <select id="min-baths" value={minBathrooms} onChange={(e) => setMinBathrooms(Number(e.target.value))} className="search-input mt-2">
          {[0, 1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>{n === 0 ? "Any" : `${n}+`}</option>
          ))}
        </select>
      </div>
      <div>
        <p className="text-sm font-medium">Property type</p>
        <div className="mt-2 space-y-2">
          {(["Apartment", "Villa", "Heritage Home"] as PropertyType[]).map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={types.includes(t)} onChange={() => toggleType(t)} className="rounded" />
              {t}
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium">Amenities</p>
        <div className="mt-2 space-y-2">
          {["Wi-Fi", "Parking", "Kitchen", "Self check-in"].map((a) => (
            <label key={a} className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={amenities.includes(a)} onChange={() => toggleAmenity(a)} className="rounded" />
              {a}
            </label>
          ))}
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={availableOnly} onChange={(e) => setAvailableOnly(e.target.checked)} className="rounded" />
        Available for selected dates
      </label>
    </div>
  );
}
