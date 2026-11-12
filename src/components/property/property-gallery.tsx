"use client";

import { useState } from "react";
import { PropertyImage } from "@/components/media/property-image";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  images: string[];
  propertyName: string;
}

export function PropertyGallery({ images, propertyName }: PropertyGalleryProps) {
  const [showAll, setShowAll] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);
  const gallery = images.length > 0 ? images : [];
  const count = gallery.length;
  const main = gallery[0];
  const thumbs = gallery.slice(1, 5);

  if (count === 0) {
    return (
      <div className="aspect-[4/3] overflow-hidden rounded-xl md:h-[420px] lg:h-[480px]">
        <PropertyImage alt={propertyName} className="rounded-xl" />
      </div>
    );
  }

  return (
    <>
      <div className="relative hidden md:block">
        <div className="grid h-[420px] grid-cols-4 grid-rows-2 gap-2 lg:h-[480px]">
          <div className="col-span-2 row-span-2 overflow-hidden rounded-l-xl">
            <PropertyImage
              src={main}
              alt={`${propertyName} — Main`}
              className="rounded-none rounded-l-xl"
              priority
            />
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
              <PropertyImage
                src={thumbs[i] || gallery[i % count]}
                alt={`${propertyName} — Photo ${i + 2}`}
                className={cn(
                  "rounded-none",
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
          View all {count} photos
        </button>
      </div>

      <div className="relative md:hidden">
        <div
          className="relative aspect-[4/3] overflow-hidden rounded-xl"
          onTouchStart={(e) => {
            (e.currentTarget as HTMLDivElement).dataset.x = String(e.touches[0].clientX);
          }}
          onTouchEnd={(e) => {
            const start = Number((e.currentTarget as HTMLDivElement).dataset.x || 0);
            const dx = e.changedTouches[0].clientX - start;
            if (dx < -40) setMobileIndex((i) => Math.min(count - 1, i + 1));
            if (dx > 40) setMobileIndex((i) => Math.max(0, i - 1));
          }}
        >
          <PropertyImage
            src={gallery[mobileIndex]}
            alt={`Photo ${mobileIndex + 1} of ${count}`}
            className="rounded-xl"
          />
          <div className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2.5 py-1 text-xs text-white">
            {mobileIndex + 1} / {count}
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
            onClick={() => setMobileIndex(Math.min(count - 1, mobileIndex + 1))}
            disabled={mobileIndex === count - 1}
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
          {gallery.map((src, i) => (
            <div key={src + i} className="aspect-[4/3] overflow-hidden rounded-xl">
              <PropertyImage src={src} alt={`Photo ${i + 1}`} className="rounded-xl" />
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
}
