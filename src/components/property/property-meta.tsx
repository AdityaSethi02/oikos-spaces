import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

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
        {rating.toFixed(2)}
      </span>
      {reviewCount !== undefined && (
        <span className="text-sm text-muted">
          ({reviewCount} review{reviewCount !== 1 ? "s" : ""})
        </span>
      )}
    </div>
  );
}

export function PropertyMeta({
  guests,
  bedrooms,
  bathrooms,
  beds,
  className,
}: {
  guests: number;
  bedrooms: number;
  bathrooms: number;
  beds?: number;
  className?: string;
}) {
  return (
    <p className={cn("text-sm text-muted", className)}>
      {guests} guest{guests !== 1 ? "s" : ""} · {bedrooms} bedroom
      {bedrooms !== 1 ? "s" : ""}
      {beds !== undefined ? ` · ${beds} bed${beds !== 1 ? "s" : ""}` : ""} · {bathrooms} bath
      {bathrooms !== 1 ? "s" : ""}
    </p>
  );
}
