import { amenityIcons, Icons } from "@/components/icons";
import type { Amenity } from "@/data/mock/properties";
import { cn } from "@/lib/utils";

interface PropertyAmenitiesProps {
  amenities: Amenity[];
  columns?: 2 | 3 | 4;
  className?: string;
}

export function PropertyAmenities({
  amenities,
  columns = 3,
  className,
}: PropertyAmenitiesProps) {
  return (
    <div
      className={cn(
        "grid gap-4",
        columns === 2 && "grid-cols-1 sm:grid-cols-2",
        columns === 3 && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {amenities.map((amenity) => {
        const Icon = amenityIcons[amenity] || Icons.Check;
        return (
          <div key={amenity} className="flex items-center gap-3 text-sm text-foreground">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-light text-accent">
              <Icon className="h-4 w-4" aria-hidden />
            </span>
            {amenity}
          </div>
        );
      })}
    </div>
  );
}

export function AmenityPills({ amenities }: { amenities: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {amenities.slice(0, 5).map((a) => {
        const Icon = amenityIcons[a] || Icons.Check;
        return (
          <span
            key={a}
            className="inline-flex items-center gap-1.5 rounded-md bg-background px-2.5 py-1 text-xs text-muted"
          >
            <Icon className="h-3.5 w-3.5" aria-hidden />
            {a}
          </span>
        );
      })}
    </div>
  );
}
