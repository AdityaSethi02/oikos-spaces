import Image from "next/image";
import type { PropertyMediaItem } from "@/server/dto/domain.dto";
import { cn } from "@/lib/utils";

function pickCover(media?: PropertyMediaItem[]): PropertyMediaItem | undefined {
  if (!media?.length) return undefined;
  return media.find((m) => m.isFeatured && m.kind === "PHOTO") ?? media.find((m) => m.kind === "PHOTO");
}

interface PropertyThumbnailProps {
  property: { id: string; name: string; media?: PropertyMediaItem[] };
  className?: string;
  sizes?: string;
}

export function PropertyThumbnail({
  property,
  className,
  sizes = "(max-width: 768px) 100vw, 400px",
}: PropertyThumbnailProps) {
  const cover = pickCover(property.media);

  if (cover?.url) {
    return (
      <div className={cn("relative overflow-hidden bg-stone-100", className)}>
        <Image
          src={cover.url}
          alt={cover.alt ?? property.name}
          fill
          className="object-cover"
          sizes={sizes}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gradient-to-br from-stone-100 to-stone-200 text-stone-400",
        className,
      )}
      aria-hidden
    >
      <span className="text-xs font-medium uppercase tracking-wider">No photo</span>
    </div>
  );
}
