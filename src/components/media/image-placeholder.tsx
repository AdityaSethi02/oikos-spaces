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
  { aspect: string; label: string; icon: string }
> = {
  hero: { aspect: "aspect-[21/9] sm:aspect-[2.4/1]", label: "Hero Image", icon: "🏡" },
  property: { aspect: "aspect-[4/3]", label: "Property Image", icon: "🏠" },
  gallery: { aspect: "aspect-[4/3]", label: "Gallery Image", icon: "📷" },
  "gallery-sm": { aspect: "aspect-square", label: "Photo", icon: "📷" },
  bedroom: { aspect: "aspect-[3/2]", label: "Bedroom", icon: "🛏️" },
  bathroom: { aspect: "aspect-[3/2]", label: "Bathroom", icon: "🚿" },
  lifestyle: { aspect: "aspect-[16/10]", label: "Lifestyle", icon: "✨" },
  video: { aspect: "aspect-video", label: "Video Tour", icon: "▶" },
  avatar: { aspect: "aspect-square", label: "", icon: "👤" },
  map: { aspect: "aspect-[16/9]", label: "Map", icon: "📍" },
};

interface ImagePlaceholderProps {
  variant?: PlaceholderVariant;
  className?: string;
  label?: string;
}

export function ImagePlaceholder({
  variant = "property",
  className,
  label,
}: ImagePlaceholderProps) {
  const style = variantStyles[variant];

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-gradient-to-br from-stone-100 via-stone-50 to-accent-light/30",
        "flex items-center justify-center border border-border/60",
        style.aspect,
        className,
      )}
      role="img"
      aria-label={label || style.label}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(166,124,82,0.08),transparent_50%)]" />
      <div className="relative flex flex-col items-center gap-2 text-muted">
        <span className="text-2xl opacity-60" aria-hidden="true">
          {style.icon}
        </span>
        {(label || style.label) && (
          <span className="text-xs font-medium tracking-wide uppercase">
            {label || style.label}
          </span>
        )}
      </div>
    </div>
  );
}
