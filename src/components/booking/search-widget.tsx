"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { brand } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SearchWidgetProps {
  variant?: "hero" | "inline";
  className?: string;
}

export function SearchWidget({ variant = "hero", className }: SearchWidgetProps) {
  const router = useRouter();
  const [location, setLocation] = useState(brand.location.split(",")[0]);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);
    params.set("guests", String(guests));
    router.push(`/stays?${params.toString()}`);
  };

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface shadow-soft",
        variant === "hero" ? "p-3 sm:p-4" : "p-3",
        className,
      )}
    >
      <div
        className={cn(
          "grid gap-3",
          variant === "hero"
            ? "sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr_0.8fr_auto]"
            : "sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_0.7fr_auto]",
        )}
      >
        <SearchField label="Where to?">
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Udaipur"
            className="search-input"
          />
        </SearchField>
        <SearchField label="Check-in">
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            className="search-input"
          />
        </SearchField>
        <SearchField label="Check-out">
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            className="search-input"
          />
        </SearchField>
        <SearchField label="Guests">
          <select
            value={guests}
            onChange={(e) => setGuests(Number(e.target.value))}
            className="search-input"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n} guest{n !== 1 ? "s" : ""}
              </option>
            ))}
          </select>
        </SearchField>
        <div className="flex items-end sm:col-span-2 lg:col-span-1">
          <Button fullWidth onClick={handleSearch} className="h-11">
            Search Stays
          </Button>
        </div>
      </div>
    </div>
  );
}

function SearchField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-medium text-muted">{label}</label>
      {children}
    </div>
  );
}

export function SearchBarCompact({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      <SearchWidget variant="inline" className="flex-1 min-w-[280px]" />
      <Link href="/stays">
        <Button variant="outline" size="sm">
          Filters
        </Button>
      </Link>
    </div>
  );
}
