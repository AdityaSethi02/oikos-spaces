"use client";

import Link from "next/link";
import { useFavorites } from "@/components/providers/favorites-provider";
import { PropertyImage } from "@/components/media/property-image";
import { PropertyMeta, StatusBadge } from "@/components/property/property-meta";
import { Card } from "@/components/ui/card";
import { Icons } from "@/components/icons";
import type { Property } from "@/data/mock/properties";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  layout?: "vertical" | "horizontal";
  showFavorite?: boolean;
  className?: string;
}

export function PropertyCard({
  property,
  layout = "vertical",
  showFavorite = true,
  className,
}: PropertyCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const href = `/properties/${property.slug}`;

  if (layout === "horizontal") {
    return (
      <Card padding="none" hover className={cn("overflow-hidden", className)}>
        <div className="flex flex-col sm:flex-row">
          <Link href={href} className="relative block w-full shrink-0 sm:w-72 lg:w-80">
            <div className="aspect-[4/3] overflow-hidden rounded-t-xl sm:aspect-auto sm:h-full sm:min-h-[220px] sm:rounded-l-xl sm:rounded-tr-none">
              <PropertyImage
                src={property.coverImage}
                alt={property.name}
                className="rounded-none rounded-t-xl sm:rounded-l-xl sm:rounded-tr-none"
              />
            </div>
            <div className="absolute left-3 top-3">
              <StatusBadge status={property.status} />
            </div>
          </Link>
          <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">
                    {property.type} · {property.locality}
                  </p>
                  <Link href={href}>
                    <h3 className="mt-1 font-serif text-xl text-foreground hover:text-accent">
                      {property.name}
                    </h3>
                  </Link>
                  <PropertyMeta
                    className="mt-2"
                    bedrooms={property.bedrooms}
                    bathrooms={property.bathrooms}
                    areaSqFt={property.areaSqFt}
                  />
                </div>
                {showFavorite && (
                  <FavoriteButton
                    active={isFavorite(property.id)}
                    onClick={() => toggleFavorite(property.id)}
                  />
                )}
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-muted">{property.description}</p>
            </div>
            <div className="mt-5 flex flex-wrap items-end justify-between gap-3">
              <p className="font-serif text-2xl text-foreground">{property.priceLabel}</p>
              <Link
                href={href}
                className="inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                View details
                <Icons.ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="none" hover className={cn("group overflow-hidden", className)}>
      <div className="relative">
        <Link href={href} className="block aspect-[4/3] overflow-hidden rounded-t-xl">
          <PropertyImage
            src={property.coverImage}
            alt={property.name}
            className="rounded-none rounded-t-xl transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </Link>
        <div className="absolute left-3 top-3 z-10">
          <StatusBadge status={property.status} />
        </div>
        {showFavorite && (
          <div className="absolute right-3 top-3 z-10">
            <FavoriteButton
              active={isFavorite(property.id)}
              onClick={() => toggleFavorite(property.id)}
            />
          </div>
        )}
      </div>
      <div className="p-4 sm:p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {property.type} · {property.locality}
        </p>
        <Link href={href}>
          <h3 className="mt-1 font-serif text-lg text-foreground group-hover:text-accent">
            {property.name}
          </h3>
        </Link>
        <PropertyMeta
          className="mt-2"
          bedrooms={property.bedrooms}
          bathrooms={property.bathrooms}
          areaSqFt={property.areaSqFt}
        />
        <p className="mt-4 font-serif text-xl text-foreground">{property.priceLabel}</p>
      </div>
    </Card>
  );
}

function FavoriteButton({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-11 w-11 items-center justify-center rounded-full bg-surface/95 shadow-sm backdrop-blur-sm transition-colors",
        active ? "text-red-500" : "text-muted hover:text-red-400",
      )}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
    >
      <Icons.Heart className={cn("h-5 w-5", active && "fill-current")} />
    </button>
  );
}
