"use client";

import Link from "next/link";
import { PropertyCard } from "@/components/property/property-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { useFavorites } from "@/components/providers/favorites-provider";
import { properties } from "@/data/mock/properties";

export default function FavoritesPage() {
  const { favorites } = useFavorites();
  const saved = properties.filter((p) => favorites.includes(p.id));

  if (saved.length === 0) {
    return (
      <div className="section-padding">
        <div className="container-page">
          <h1 className="font-serif text-3xl">Saved stays</h1>
          <EmptyState
            className="mt-10"
            title="You haven't saved any stays yet"
            description="Tap the heart on any property to save it for later."
            actionLabel="Explore stays"
            actionHref="/stays"
            icon="♡"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding">
      <div className="container-page">
        <h1 className="font-serif text-3xl">Saved stays</h1>
        <p className="mt-2 text-muted">{saved.length} saved propert{saved.length !== 1 ? "ies" : "y"}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((property) => (
            <div key={property.id} className="space-y-3">
              <PropertyCard property={property} />
              <Link href={`/stays/${property.slug}/availability`} className="block">
                <Button variant="outline" size="sm" fullWidth>Check availability</Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
