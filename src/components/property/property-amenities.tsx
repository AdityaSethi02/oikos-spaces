import type { Amenity } from "@/data/mock/properties";
import { cn } from "@/lib/utils";

const amenityIcons: Record<string, string> = {
  "Wi-Fi": "📶",
  Kitchen: "🍳",
  Parking: "🅿️",
  TV: "📺",
  Workspace: "💻",
  Balcony: "🌿",
  "Air conditioning": "❄️",
  "Hot water": "🚿",
  "Self check-in": "🔑",
  "Washing machine": "🧺",
  Garden: "🌳",
  "Rooftop terrace": "🏙️",
};

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
      {amenities.map((amenity) => (
        <div key={amenity} className="flex items-center gap-3 text-sm text-foreground">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-light text-base">
            {amenityIcons[amenity] || "✓"}
          </span>
          {amenity}
        </div>
      ))}
    </div>
  );
}

export function AmenityPills({ amenities }: { amenities: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {amenities.slice(0, 5).map((a) => (
        <span
          key={a}
          className="rounded-md bg-background px-2.5 py-1 text-xs text-muted"
        >
          {amenityIcons[a] || "✓"} {a}
        </span>
      ))}
    </div>
  );
}
