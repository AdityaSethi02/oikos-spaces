"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { brand } from "@/lib/brand";
import { Button, ButtonLink } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
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
        "relative z-20 overflow-visible rounded-xl border border-border bg-surface shadow-soft",
        variant === "hero" ? "p-3 sm:p-4" : "p-3",
        className,
      )}
    >
      <div
        className={cn(
          "grid gap-3 overflow-visible",
          variant === "hero"
            ? "sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_auto]"
            : "sm:grid-cols-2 lg:grid-cols-4",
        )}
      >
        <Select
          label="Locality"
          aria-label="Locality"
          value={locality}
          onChange={setLocality}
          options={[
            { value: "All", label: `All in ${brand.location.split(",")[0]}` },
            ...localities.map((l) => ({ value: l, label: l })),
          ]}
        />
        <Select
          label="Looking to"
          aria-label="Listing status"
          value={status}
          onChange={(v) => setStatus(v as ListingStatus | "All")}
          options={[
            { value: "All", label: "Buy / Rent / Lease" },
            ...allListingStatuses.map((s) => ({ value: s, label: s })),
          ]}
        />
        <Select
          label="Bedrooms"
          aria-label="Bedrooms"
          value={bedrooms}
          onChange={setBedrooms}
          options={[
            { value: "0", label: "Any" },
            { value: "1", label: "1+ BHK" },
            { value: "2", label: "2+ BHK" },
            { value: "3", label: "3+ BHK" },
            { value: "4", label: "4+ BHK" },
          ]}
        />
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
