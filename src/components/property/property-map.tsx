import { Icons } from "@/components/icons";
import { buildGoogleMapsSearchUrl } from "@/lib/maps";
import { cn } from "@/lib/utils";

interface PropertyMapProps {
  latitude?: number | null;
  longitude?: number | null;
  address: string;
  propertyName?: string;
  className?: string;
}

export function PropertyMap({
  latitude,
  longitude,
  address,
  propertyName,
  className,
}: PropertyMapProps) {
  const mapsUrl = buildGoogleMapsSearchUrl({ latitude, longitude, address });

  if (!mapsUrl) {
    return (
      <div
        className={cn(
          "flex min-h-[200px] items-center justify-center rounded-xl border border-border bg-stone-50 p-6 text-center text-sm text-muted",
          className,
        )}
      >
        <p>
          Map unavailable — add coordinates or a full address in the property admin settings to
          enable Google Maps.
        </p>
      </div>
    );
  }

  const label = propertyName
    ? `Open ${propertyName} in Google Maps`
    : `Open ${address} in Google Maps`;

  return (
    <div className={className}>
      <a
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className={cn(
          "group relative flex h-[280px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-border",
          "bg-gradient-to-br from-stone-100 via-stone-50 to-accent-light/40",
          "transition-shadow hover:border-accent/40 hover:shadow-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/30",
        )}
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          aria-hidden
          style={{
            backgroundImage:
              "linear-gradient(to right, #d6d3d1 1px, transparent 1px), linear-gradient(to bottom, #d6d3d1 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative flex flex-col items-center gap-3 px-6 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-surface shadow-soft">
            <Icons.MapPin className="h-6 w-6 text-accent" aria-hidden />
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">{address}</p>
            <p className="mt-2 text-sm text-accent group-hover:underline">
              Open in Google Maps →
            </p>
          </div>
        </div>
      </a>
    </div>
  );
}
