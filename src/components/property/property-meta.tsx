import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";
import type { ListingStatus } from "@/data/mock/properties";

export function StarRating({
  rating,
  reviewCount,
  size = "sm",
}: {
  rating: number;
  reviewCount?: number;
  size?: "sm" | "md";
}) {
  return (
    <div className="flex items-center gap-1.5">
      <Icons.Star
        className={cn(
          "fill-accent text-accent",
          size === "sm" ? "h-4 w-4" : "h-5 w-5",
        )}
        aria-hidden
      />
      <span
        className={cn(
          "font-medium text-foreground",
          size === "sm" ? "text-sm" : "text-base",
        )}
      >
        {rating.toFixed(1)}
      </span>
      {reviewCount !== undefined && (
        <span className="text-sm text-muted">
          ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
        </span>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: ListingStatus }) {
  return (
    <span className="inline-flex rounded-md bg-accent-light px-2 py-0.5 text-xs font-medium text-accent">
      {status}
    </span>
  );
}

export function PropertyMeta({
  bedrooms,
  bathrooms,
  areaSqFt,
  className,
}: {
  bedrooms: number;
  bathrooms: number;
  areaSqFt?: number;
  className?: string;
}) {
  const parts: string[] = [];
  if (bedrooms > 0) {
    parts.push(`${bedrooms} BHK`);
  }
  if (bathrooms > 0) {
    parts.push(`${bathrooms} bath${bathrooms !== 1 ? "s" : ""}`);
  }
  if (areaSqFt !== undefined && areaSqFt > 0) {
    parts.push(`${areaSqFt.toLocaleString("en-IN")} sq.ft`);
  }

  return (
    <p className={cn("text-sm text-muted", className)}>
      {parts.join(" · ") || "Details on request"}
    </p>
  );
}
