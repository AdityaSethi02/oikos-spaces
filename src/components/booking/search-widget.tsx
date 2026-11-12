"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { brand } from "@/lib/brand";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { localities, allListingStatuses, type ListingStatus } from "@/data/mock/properties";

interface SearchWidgetProps {
  variant?: "hero" | "inline";
  className?: string;
}

export function SearchWidget({ variant = "hero", className }: SearchWidgetProps) {
  const router = useRouter();
  const [locality, setLocality] = useState("All");
  const [status, setStatus] = useState<ListingStatus | "All">("For Sale");
  const [bedrooms, setBedrooms] = useState("0");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (locality !== "All") params.set("locality", locality);
    if (status !== "All") params.set("status", status);
    if (bedrooms !== "0") params.set("beds", bedrooms);
    const qs = params.toString();
    router.push(qs ? `/properties?${qs}` : "/properties");
  };

  return (
    <div
      className={cn(
        "relative z-10 rounded-xl border border-border bg-surface shadow-soft",
        variant === "hero" ? "p-3 sm:p-4" : "p-3",
        className,
      )}
    >
      <div
        className={cn(
          "grid gap-3",
          variant === "hero"
            ? "sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_auto]"
            : "sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">Locality</span>
          <select
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="search-input"
            aria-label="Locality"
          >
            <option value="All">All in {brand.location.split(",")[0]}</option>
            {localities.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">Looking to</span>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as ListingStatus | "All")}
            className="search-input"
            aria-label="Listing status"
          >
            <option value="All">Buy / Rent / Lease</option>
            {allListingStatuses.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-medium text-muted">Bedrooms</span>
          <select
            value={bedrooms}
            onChange={(e) => setBedrooms(e.target.value)}
            className="search-input"
            aria-label="Bedrooms"
          >
            <option value="0">Any</option>
            <option value="1">1+ BHK</option>
            <option value="2">2+ BHK</option>
            <option value="3">3+ BHK</option>
            <option value="4">4+ BHK</option>
          </select>
        </label>
        <div className="flex items-end">
          <Button fullWidth onClick={handleSearch}>
            Search
          </Button>
        </div>
      </div>
    </div>
  );
}

export function SearchWidgetCompact({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <SearchWidget variant="inline" className="min-w-0 flex-1" />
      <ButtonLink href="/properties" variant="outline" size="sm" className="shrink-0">
        All properties
      </ButtonLink>
    </div>
  );
}
