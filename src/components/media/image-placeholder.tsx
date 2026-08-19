"use client";

import { useState } from "react";
import { placeholderIcons } from "@/components/icons";
import { cn } from "@/lib/utils";

export type PlaceholderVariant =
  | "hero"
  | "property"
  | "gallery"
  | "gallery-sm"
  | "bedroom"
  | "bathroom"
  | "lifestyle"
  | "video"
  | "avatar"
  | "map";

const variantStyles: Record<
  PlaceholderVariant,
  { aspect: string; label: string }
> = {
  hero: { aspect: "aspect-[21/9] sm:aspect-[2.4/1]", label: "Hero Image" },
  property: { aspect: "aspect-[4/3]", label: "Property Image" },
  gallery: { aspect: "aspect-[4/3]", label: "Gallery Image" },
  "gallery-sm": { aspect: "aspect-square", label: "Photo" },
  bedroom: { aspect: "aspect-[3/2]", label: "Bedroom" },
  bathroom: { aspect: "aspect-[3/2]", label: "Bathroom" },
  lifestyle: { aspect: "aspect-[16/10]", label: "Lifestyle" },
  video: { aspect: "aspect-video", label: "Video Tour" },
  avatar: { aspect: "aspect-square", label: "" },
  map: { aspect: "aspect-[16/9]", label: "Map" },
};

// picsum.photos returns a real photo for any integer id — guaranteed to work
// We use hand-picked IDs that visually match each variant (interiors, landscapes, etc.)
const picsumIds: Record<PlaceholderVariant, number[]> = {
  hero:       [1029, 1040, 1076, 532, 667],
  property:   [1067, 1068, 1082, 239, 399],
  gallery:    [1067, 1068, 1082, 239, 1060, 1063, 1071, 399],
  "gallery-sm": [1082, 239, 1060, 1063, 1071, 399, 1067, 1068],
  bedroom:    [1090, 1091, 271, 585],
  bathroom:   [1084, 1085, 1086, 1087],
  lifestyle:  [1029, 1040, 1076, 532],
  video:      [1060, 1063],
  avatar:     [64, 65, 91, 177, 453],
  map:        [1024, 1025],
};

function getPhotoUrl(
  variant: PlaceholderVariant,
  seed: number,
  width: number,
  height: number,
): string {
  const ids = picsumIds[variant];
  const id = ids[seed % ids.length];
  return `https://picsum.photos/id/${id}/${width}/${height}`;
}

interface ImagePlaceholderProps {
  variant?: PlaceholderVariant;
  className?: string;
  label?: string;
  /** 0-based index — keeps the same image consistent across renders */
  seed?: number;
}

export function ImagePlaceholder({
  variant = "property",
  className,
  label,
  seed = 0,
}: ImagePlaceholderProps) {
  const style = variantStyles[variant];
  const Icon = placeholderIcons[variant];
  const [failed, setFailed] = useState(false);

  // Derive pixel dimensions from the aspect ratio string so we request
  // a sensibly-sized image from Unsplash (avoids giant downloads).
  const dims: Record<PlaceholderVariant, [number, number]> = {
    hero: [1600, 640],
    property: [800, 600],
    gallery: [800, 600],
    "gallery-sm": [600, 600],
    bedroom: [900, 600],
    bathroom: [900, 600],
    lifestyle: [1000, 625],
    video: [1280, 720],
    avatar: [200, 200],
    map: [1280, 720],
  };
  const [w, h] = dims[variant];
  const src = getPhotoUrl(variant, seed, w, h);
  const altText = label || style.label;

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-br from-stone-100 via-stone-50 to-accent-light/30",
        "flex items-center justify-center border border-border/60",
        className,
        // aspect comes last so className can override it (e.g. h-full, aspect-square)
        !className?.includes("aspect-") && !className?.includes("h-full") && style.aspect,
      )}
      role="img"
      aria-label={altText}
    >
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={altText}
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        // Graceful fallback — styled icon shown when offline or photo 404s
        <>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(166,124,82,0.08),transparent_50%)]" />
          <div className="relative flex flex-col items-center gap-2 text-muted">
            <Icon className="h-7 w-7 opacity-60" aria-hidden />
            {altText && (
              <span className="text-xs font-medium tracking-wide uppercase">
                {altText}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
