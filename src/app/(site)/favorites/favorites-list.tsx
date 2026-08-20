"use client";

import Link from "next/link";
import { PropertyCard } from "@/components/property/property-card";
import { EmptyState } from "@/components/feedback/empty-state";
import type { Property } from "@/server/dto/domain.dto";
import { useFavorites } from "@/components/providers/favorites-provider";

export function FavoritesList({ properties }: { properties: Property[] }) {
  const { loaded } = useFavorites();

  if (!loaded) {
    return <p className="section-padding text-muted">Loading saved stays…</p>;
  }

  if (properties.length === 0) {
    return (
      <div className="section-padding">
        <div className="container-page">
          <h1 className="font-serif text-3xl">Saved stays</h1>
          <EmptyState
            className="mt-10"
            title="No favorites yet"
            description="Tap the heart on a property to save it here."
            actionLabel="Browse stays"
            actionHref="/stays"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-page">
        <h1 className="font-serif text-3xl">Saved stays</h1>
        <p className="mt-2 text-muted">{properties.length} saved</p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        <p className="mt-8 text-sm text-muted">
          <Link href="/stays" className="text-accent hover:underline">Browse all stays</Link>
        </p>
      </div>
    </div>
  );
}
