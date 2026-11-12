"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { PropertyCard } from "@/components/property/property-card";
import { Drawer } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { Icons } from "@/components/icons";
import {
  properties,
  localities,
  allPropertyTypes,
  allListingStatuses,
  type PropertyType,
  type ListingStatus,
} from "@/data/mock/properties";
import { formatCurrency } from "@/lib/utils";

export function PropertiesContent() {
  const searchParams = useSearchParams();
  const initialLocality = searchParams.get("locality") || "All";
  const initialStatus = searchParams.get("status");
  const initialBeds = Number(searchParams.get("beds") || 0);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(4_00_00_000);
  const [minBedrooms, setMinBedrooms] = useState(initialBeds);
  const [statuses, setStatuses] = useState<ListingStatus[]>(
    initialStatus && allListingStatuses.includes(initialStatus as ListingStatus)
      ? [initialStatus as ListingStatus]
      : [...allListingStatuses],
  );
  const [types, setTypes] = useState<PropertyType[]>([...allPropertyTypes]);
  const [locality, setLocality] = useState<string>(initialLocality);

  const filtered = useMemo(
    () =>
      properties.filter((p) => {
        if (p.price > maxPrice) return false;
        if (minBedrooms > 0 && p.bedrooms < minBedrooms) return false;
        if (!statuses.includes(p.status)) return false;
        if (!types.includes(p.type)) return false;
        if (locality !== "All" && p.locality !== locality) return false;
        return true;
      }),
    [maxPrice, minBedrooms, statuses, types, locality],
  );

  const reset = () => {
    setMaxPrice(4_00_00_000);
    setMinBedrooms(0);
    setStatuses([...allListingStatuses]);
    setTypes([...allPropertyTypes]);
    setLocality("All");
  };

  const filterProps = {
    maxPrice,
    setMaxPrice,
    minBedrooms,
    setMinBedrooms,
    statuses,
    setStatuses,
    types,
    setTypes,
    locality,
    setLocality,
  };

  return (
    <div className="section-padding">
      <div className="container-page">
        <nav className="text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">Properties</span>
        </nav>
        <div className="mb-8 mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl">Properties</h1>
            <p className="mt-2 text-muted">
              Buy, rent or lease across Udaipur&apos;s trusted neighbourhoods.
            </p>
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
              {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
            </p>
            {filtered.length === 0 ? (
              <EmptyState
                title="No properties match these filters"
                description="Try adjusting budget, type, or locality."
                actionLabel="Reset filters"
                onAction={reset}
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
  minBedrooms,
  setMinBedrooms,
  statuses,
  setStatuses,
  types,
  setTypes,
  locality,
  setLocality,
}: {
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  minBedrooms: number;
  setMinBedrooms: (v: number) => void;
  statuses: ListingStatus[];
  setStatuses: (v: ListingStatus[]) => void;
  types: PropertyType[];
  setTypes: (v: PropertyType[]) => void;
  locality: string;
  setLocality: (v: string) => void;
}) {
  const toggleStatus = (s: ListingStatus) => {
    setStatuses(statuses.includes(s) ? statuses.filter((x) => x !== s) : [...statuses, s]);
  };
  const toggleType = (t: PropertyType) => {
    setTypes(types.includes(t) ? types.filter((x) => x !== t) : [...types, t]);
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-medium" htmlFor="max-price">
          Max budget
        </label>
        <input
          id="max-price"
          type="range"
          min={25_000}
          max={4_00_00_000}
          step={25_000}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="mt-2 w-full"
        />
        <p className="mt-1 text-sm text-muted">Up to {formatCurrency(maxPrice)}</p>
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="locality">
          Locality
        </label>
        <select
          id="locality"
          value={locality}
          onChange={(e) => setLocality(e.target.value)}
          className="search-input mt-2"
        >
          <option value="All">All localities</option>
          {localities.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="text-sm font-medium" htmlFor="min-beds">
          Bedrooms
        </label>
        <select
          id="min-beds"
          value={minBedrooms}
          onChange={(e) => setMinBedrooms(Number(e.target.value))}
          className="search-input mt-2"
        >
          {[0, 1, 2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n === 0 ? "Any" : `${n}+ BHK`}
            </option>
          ))}
        </select>
      </div>
      <div>
        <p className="text-sm font-medium">Listing type</p>
        <div className="mt-2 space-y-2">
          {allListingStatuses.map((s) => (
            <label key={s} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={statuses.includes(s)}
                onChange={() => toggleStatus(s)}
                className="rounded"
              />
              {s}
            </label>
          ))}
        </div>
      </div>
      <div>
        <p className="text-sm font-medium">Property type</p>
        <div className="mt-2 space-y-2">
          {allPropertyTypes.map((t) => (
            <label key={t} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={types.includes(t)}
                onChange={() => toggleType(t)}
                className="rounded"
              />
              {t}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
