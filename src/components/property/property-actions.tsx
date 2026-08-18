"use client";

import { useFavorites } from "@/components/providers/favorites-provider";
import { useToast } from "@/components/providers/toast-provider";

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
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={handleShare}
        className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-background hover:text-foreground"
      >
        Share
      </button>
      <button
        type="button"
        onClick={() => toggleFavorite(propertyId)}
        className="rounded-lg px-3 py-2 text-sm text-muted hover:bg-background hover:text-foreground"
        aria-pressed={saved}
      >
        {saved ? "Saved" : "Save"}
      </button>
    </div>
  );
}
