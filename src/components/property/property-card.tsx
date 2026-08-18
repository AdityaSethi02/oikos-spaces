"use client";

import Link from "next/link";
import { useFavorites } from "@/components/providers/favorites-provider";
import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { StarRating, PropertyMeta } from "@/components/property/property-meta";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { Property } from "@/data/mock/properties";
import { formatCurrency } from "@/lib/utils";
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

  if (layout === "horizontal") {
    return (
      <Card padding="none" hover className={cn("overflow-hidden", className)}>
        <div className="flex flex-col sm:flex-row">
          <Link
            href={`/stays/${property.slug}`}
            className="relative block w-full shrink-0 sm:w-72 lg:w-80"
          >
            <ImagePlaceholder
              variant="property"
              className="h-full min-h-[200px] rounded-none rounded-t-xl sm:min-h-[220px] sm:rounded-l-xl sm:rounded-tr-none"
            />
          </Link>
          <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link href={`/stays/${property.slug}`}>
                    <h3 className="font-serif text-xl text-foreground hover:text-accent">
                      {property.name}
                    </h3>
                  </Link>
                  <p className="mt-1 text-sm text-muted">{property.location}</p>
                </div>
                {showFavorite && (
                  <FavoriteButton
                    active={isFavorite(property.id)}
                    onClick={() => toggleFavorite(property.id)}
                  />
                )}
              </div>
              <p className="mt-3 line-clamp-2 text-sm text-muted">
                {property.description}
              </p>
              <PropertyMeta
                className="mt-3"
                guests={property.guests}
                bedrooms={property.bedrooms}
                bathrooms={property.bathrooms}
              />
              <div className="mt-3">
                <StarRating
                  rating={property.rating}
                  reviewCount={property.reviewCount}
                />
              </div>
            </div>
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-foreground">
                <span className="font-semibold">
                  {formatCurrency(property.pricePerNight)}
                </span>
                <span className="text-sm text-muted"> / night</span>
              </p>
              <Link href={`/stays/${property.slug}`}>
                <Button variant="outline" size="sm">
                  View details
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card padding="none" hover className={cn("group overflow-hidden", className)}>
      <Link href={`/stays/${property.slug}`} className="relative block">
        <ImagePlaceholder
          variant="property"
          className="rounded-none rounded-t-xl transition-transform duration-300 group-hover:scale-[1.02]"
        />
        {showFavorite && (
          <div className="absolute right-3 top-3">
            <FavoriteButton
              active={isFavorite(property.id)}
              onClick={(e) => {
                e.preventDefault();
                toggleFavorite(property.id);
              }}
            />
          </div>
        )}
      </Link>
      <div className="p-4 sm:p-5">
        <Link href={`/stays/${property.slug}`}>
          <h3 className="font-serif text-lg text-foreground group-hover:text-accent">
            {property.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-muted">{property.location}</p>
        <p className="mt-1 text-xs text-muted-foreground">{property.type}</p>
        <PropertyMeta
          className="mt-2"
          guests={property.guests}
          bedrooms={property.bedrooms}
          bathrooms={property.bathrooms}
        />
        <div className="mt-3">
          <StarRating rating={property.rating} reviewCount={property.reviewCount} />
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-foreground">
            <span className="font-semibold">
              {formatCurrency(property.pricePerNight)}
            </span>
            <span className="text-sm text-muted"> / night</span>
          </p>
          <Link href={`/stays/${property.slug}`}>
            <Button variant="outline" size="sm">
              View
            </Button>
          </Link>
        </div>
      </div>
    </Card>
  );
}

function FavoriteButton({
  active,
  onClick,
}: {
  active: boolean;
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-full bg-surface/90 shadow-sm backdrop-blur-sm transition-colors",
        active ? "text-red-500" : "text-muted hover:text-red-400",
      )}
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
    >
      {active ? "♥" : "♡"}
    </button>
  );
}
