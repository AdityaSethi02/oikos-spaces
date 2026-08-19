"use client";

import { useState } from "react";
import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  galleryCount?: number;
  propertyName: string;
}

export function PropertyGallery({
  galleryCount = 12,
  propertyName,
}: PropertyGalleryProps) {
  const [showAll, setShowAll] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);

  return (
    <>
      <div className="relative hidden md:block">
        <div className="grid h-[420px] grid-cols-4 grid-rows-2 gap-2 lg:h-[480px]">
          <div className="col-span-2 row-span-2 overflow-hidden rounded-l-xl">
            <ImagePlaceholder variant="gallery" className="h-full rounded-none rounded-l-xl" label={`${propertyName} — Main`} seed={0} />
          </div>
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={cn(
                "overflow-hidden",
                i === 1 && "rounded-tr-xl",
                i === 3 && "rounded-br-xl",
              )}
            >
              <ImagePlaceholder
                variant="gallery-sm"
                seed={i + 1}
                className={cn(
                  "h-full rounded-none",
                  i === 1 && "rounded-tr-xl",
                  i === 3 && "rounded-br-xl",
                )}
              />
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="absolute bottom-4 right-4 flex min-h-11 items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium shadow-soft hover:bg-background"
        >
          View all {galleryCount} photos
        </button>
      </div>

      <div className="relative md:hidden">
        <div
          className="relative overflow-hidden rounded-xl"
          onTouchStart={(e) => {
            (e.currentTarget as HTMLDivElement).dataset.x = String(e.touches[0].clientX);
          }}
          onTouchEnd={(e) => {
            const start = Number((e.currentTarget as HTMLDivElement).dataset.x || 0);
            const dx = e.changedTouches[0].clientX - start;
            if (dx < -40) setMobileIndex((i) => Math.min(galleryCount - 1, i + 1));
            if (dx > 40) setMobileIndex((i) => Math.max(0, i - 1));
          }}
        >
          <ImagePlaceholder variant="property" seed={mobileIndex} label={`Photo ${mobileIndex + 1} of ${galleryCount}`} />
          <div className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2.5 py-1 text-xs text-white">
            {mobileIndex + 1} / {galleryCount}
          </div>
        </div>
        <div className="mt-2 flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileIndex(Math.max(0, mobileIndex - 1))}
            disabled={mobileIndex === 0}
            aria-label="Previous photo"
          >
            <Icons.ChevronLeft className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setMobileIndex(Math.min(galleryCount - 1, mobileIndex + 1))}
            disabled={mobileIndex === galleryCount - 1}
            aria-label="Next photo"
          >
            <Icons.ChevronRight className="h-5 w-5" />
          </Button>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="mt-2 w-full"
          onClick={() => setShowAll(true)}
        >
          View all photos
        </Button>
      </div>

      <Modal open={showAll} onClose={() => setShowAll(false)} title="All photos" size="lg">
        <div className="grid gap-3 sm:grid-cols-2">
          {Array.from({ length: Math.min(galleryCount, 8) }).map((_, i) => (
            <ImagePlaceholder key={i} variant="gallery" seed={i} label={`Photo ${i + 1}`} />
          ))}
        </div>
      </Modal>
    </>
  );
}
