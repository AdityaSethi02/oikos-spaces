"use client";

import { Icons } from "@/components/icons";
import { useFavorites } from "@/components/providers/favorites-provider";
import { useToast } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils";

export function PropertyActions({
  propertyId,
  propertyName,
}: {
  propertyId: string;
  propertyName: string;
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const { showToast } = useToast();
  const saved = isFavorite(propertyId);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: propertyName, url }).catch(() => undefined);
    } else {
      await navigator.clipboard.writeText(url);
      showToast("Link copied", "success");
    }
  };

  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted hover:bg-background hover:text-foreground"
      >
        <Icons.Share className="h-4 w-4" aria-hidden />
        Share
      </button>
      <button
        type="button"
        onClick={() => toggleFavorite(propertyId)}
        className={cn(
          "inline-flex min-h-11 items-center gap-1.5 rounded-lg px-3 py-2 text-sm hover:bg-background",
          saved ? "text-red-500" : "text-muted hover:text-foreground",
        )}
        aria-pressed={saved}
      >
        <Icons.Heart className={cn("h-4 w-4", saved && "fill-current")} aria-hidden />
        {saved ? "Saved" : "Save"}
      </button>
    </div>
  );
}
