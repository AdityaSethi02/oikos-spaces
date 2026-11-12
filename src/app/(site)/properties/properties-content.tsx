"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
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
import { Select } from "@/components/ui/select";
import { formatCurrency, cn } from "@/lib/utils";

type Intent = "All" | "For Sale" | "For Rent" | "For Lease";

export function PropertiesContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialLocality = searchParams.get("locality") || "All";
  const initialStatus = searchParams.get("status");
  const initialBeds = Number(searchParams.get("beds") || 0);

  const [filtersOpen, setFiltersOpen] = useState(false);
  const [maxPrice, setMaxPrice] = useState(4_00_00_000);
  const [minBedrooms, setMinBedrooms] = useState(initialBeds);
  const [intent, setIntent] = useState<Intent>(
    initialStatus && allListingStatuses.includes(initialStatus as ListingStatus)
      ? (initialStatus as Intent)
      : "All",
  );
  const [types, setTypes] = useState<PropertyType[]>([...allPropertyTypes]);
  const [locality, setLocality] = useState<string>(initialLocality);

  useEffect(() => {
    const params = new URLSearchParams();
    if (locality !== "All") params.set("locality", locality);
    if (intent !== "All") params.set("status", intent);
    if (minBedrooms > 0) params.set("beds", String(minBedrooms));
    const nextQs = params.toString();
    const currentQs = searchParams.toString();
    if (nextQs === currentQs) return;
    router.replace(nextQs ? `${pathname}?${nextQs}` : pathname, { scroll: false });
  }, [locality, intent, minBedrooms, pathname, router, searchParams]);

  const filtered = useMemo(
    () =>
      properties.filter((p) => {
        if (p.price > maxPrice) return false;
        if (minBedrooms > 0 && p.bedrooms < minBedrooms) return false;
        if (intent !== "All" && p.status !== intent) return false;
        if (!types.includes(p.type)) return false;
        if (locality !== "All" && p.locality !== locality) return false;
        return true;
      }),
    [maxPrice, minBedrooms, intent, types, locality],
  );

  const reset = () => {
    setMaxPrice(4_00_00_000);
    setMinBedrooms(0);
    setIntent("All");
    setTypes([...allPropertyTypes]);
    setLocality("All");
  };

  const intents: Intent[] = ["All", "For Sale", "For Rent", "For Lease"];
  const topLocalities = ["All", ...localities.slice(0, 8)];

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

        <div className="mb-6 mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl">Properties</h1>
            <p className="mt-2 text-muted">
              Find homes, villas, plots and commercial spaces in Udaipur.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setFiltersOpen(true)}
            className="shrink-0 lg:hidden"
          >
            <Icons.Filter className="h-4 w-4" />
            More filters
          </Button>
        </div>

        <div className="chip-scroll">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {intents.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setIntent(item)}
                className={cn("chip shrink-0", intent === item && "chip-active")}
              >
                {item === "All" ? "All listings" : item.replace("For ", "")}
              </button>
            ))}
          </div>
        </div>

        <div className="chip-scroll mt-3">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {topLocalities.map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocality(l)}
                className={cn("chip shrink-0", locality === l && "chip-active")}
              >
                {l === "All" ? "All localities" : l}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8 flex gap-8">
          <aside className="hidden w-64 shrink-0 lg:block">
            <FilterPanel
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              minBedrooms={minBedrooms}
              setMinBedrooms={setMinBedrooms}
              types={types}
              setTypes={setTypes}
            />
          </aside>

          <div className="min-w-0 flex-1 space-y-6">
            <p className="sticky top-16 z-20 -mx-1 bg-background/95 px-1 py-2 text-sm text-muted backdrop-blur-sm lg:top-[4.5rem]">
              {filtered.length} listing{filtered.length !== 1 ? "s" : ""}
              {intent !== "All" ? ` · ${intent}` : ""}
              {locality !== "All" ? ` · ${locality}` : ""}
            </p>
            {filtered.length === 0 ? (
              <EmptyState
                title="No properties match these filters"
                description="Try another locality, budget, or listing type."
                actionLabel="Clear filters"
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

      <Drawer
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        title="Filters"
        fullWidth
      >
        <div className="p-4">
          <FilterPanel
            maxPrice={maxPrice}
            setMaxPrice={setMaxPrice}
            minBedrooms={minBedrooms}
            setMinBedrooms={setMinBedrooms}
            types={types}
            setTypes={setTypes}
          />
          <Button fullWidth className="mt-6" onClick={() => setFiltersOpen(false)}>
            Show {filtered.length} listings
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
  types,
  setTypes,
}: {
  maxPrice: number;
  setMaxPrice: (v: number) => void;
  minBedrooms: number;
  setMinBedrooms: (v: number) => void;
  types: PropertyType[];
  setTypes: (v: PropertyType[]) => void;
}) {
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
          className="mt-2 w-full accent-[var(--accent)]"
        />
        <p className="mt-1 text-sm text-muted">Up to {formatCurrency(maxPrice)}</p>
      </div>
      <div>
        <p className="text-sm font-medium">Bedrooms</p>
        <Select
          className="mt-2"
          aria-label="Bedrooms"
          value={String(minBedrooms)}
          onChange={(v) => setMinBedrooms(Number(v))}
          options={[0, 1, 2, 3, 4].map((n) => ({
            value: String(n),
            label: n === 0 ? "Any" : `${n}+ BHK`,
          }))}
        />
      </div>
      <div>
        <p className="text-sm font-medium">Property type</p>
        <div className="mt-2 space-y-2">
          {allPropertyTypes.map((t) => (
            <label key={t} className="flex min-h-11 items-center gap-2 text-sm">
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
