"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { PropertyVideoPlayer } from "@/components/media/property-video-player";
import type { PropertyMediaItem } from "@/server/dto/domain.dto";
import { cn } from "@/lib/utils";

interface PropertyGalleryProps {
  media?: PropertyMediaItem[];
  propertyName: string;
}

function GalleryImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      unoptimized
      className={cn("object-cover", className)}
      sizes="(max-width: 768px) 100vw, 50vw"
    />
  );
}

function GalleryEmptyState({ propertyName }: { propertyName: string }) {
  return (
    <div
      className={cn(
        "flex h-[280px] items-center justify-center rounded-xl border border-border/60 md:h-[420px] lg:h-[480px]",
        "bg-gradient-to-br from-stone-100 via-stone-50 to-accent-light/30",
      )}
      aria-label={`${propertyName} — no photos yet`}
    >
      <div className="flex flex-col items-center gap-2 text-muted">
        <Icons.Image className="h-8 w-8 opacity-60" aria-hidden />
        <span className="text-sm font-medium">Photos coming soon</span>
      </div>
    </div>
  );
}

export function PropertyGallery({ media, propertyName }: PropertyGalleryProps) {
  const [showAll, setShowAll] = useState(false);
  const [mobileIndex, setMobileIndex] = useState(0);

  const photos = useMemo(
    () =>
      (media ?? [])
        .filter((item) => item.kind === "PHOTO" && item.url)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [media],
  );

  const videos = useMemo(
    () =>
      (media ?? [])
        .filter((item) => item.kind === "VIDEO" && item.playbackId)
        .sort((a, b) => a.sortOrder - b.sortOrder),
    [media],
  );

  const galleryCount = photos.length;

  if (galleryCount === 0 && videos.length === 0) {
    return <GalleryEmptyState propertyName={propertyName} />;
  }

  if (galleryCount === 0) {
    return (
      <div className="space-y-6">
        <h2 className="font-serif text-xl">Video tour</h2>
        {videos.map((video) => (
          <PropertyVideoPlayer
            key={video.id}
            playbackId={video.playbackId!}
            title={video.alt ?? `${propertyName} video tour`}
          />
        ))}
      </div>
    );
  }

  const mainPhoto = photos.find((p) => p.isFeatured) ?? photos[0];
  const gridPhotos = photos.filter((p) => p.id !== mainPhoto.id).slice(0, 4);
  const paddedGrid = [...gridPhotos, ...Array(Math.max(0, 4 - gridPhotos.length)).fill(null)];

  return (
    <>
      <div className="relative hidden md:block">
        <div className="grid h-[420px] grid-cols-4 grid-rows-2 gap-2 lg:h-[480px]">
          <div className="relative col-span-2 row-span-2 overflow-hidden rounded-l-xl">
            <GalleryImage
              src={mainPhoto.url}
              alt={mainPhoto.alt ?? `${propertyName} — Main`}
            />
          </div>
          {paddedGrid.map((photo, i) => (
            <div
              key={photo?.id ?? `empty-${i}`}
              className={cn(
                "relative overflow-hidden",
                i === 1 && "rounded-tr-xl",
                i === 3 && "rounded-br-xl",
                !photo && "bg-gradient-to-br from-stone-100 via-stone-50 to-accent-light/30",
              )}
            >
              {photo ? (
                <GalleryImage
                  src={photo.url}
                  alt={photo.alt ?? `${propertyName} — Photo ${i + 2}`}
                  className={cn(
                    i === 1 && "rounded-tr-xl",
                    i === 3 && "rounded-br-xl",
                  )}
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Icons.Image className="h-5 w-5 text-muted opacity-40" aria-hidden />
                </div>
              )}
            </div>
          ))}
        </div>
        {galleryCount > 1 && (
          <button
            type="button"
            onClick={() => setShowAll(true)}
            className="absolute bottom-4 right-4 flex min-h-11 items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium shadow-soft hover:bg-background"
          >
            View all {galleryCount} photos
          </button>
        )}
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
            if (dx < -40) setMobileIndex((i) => Math.min(galleryCount - 1, i + 1));
            if (dx > 40) setMobileIndex((i) => Math.max(0, i - 1));
          }}
        >
          <GalleryImage
            src={photos[mobileIndex].url}
            alt={photos[mobileIndex].alt ?? `Photo ${mobileIndex + 1} of ${galleryCount}`}
          />
          <div className="absolute bottom-3 right-3 rounded-md bg-black/60 px-2.5 py-1 text-xs text-white">
            {mobileIndex + 1} / {galleryCount}
          </div>
        </div>
        {galleryCount > 1 && (
          <>
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
          </>
        )}
      </div>

      <Modal open={showAll} onClose={() => setShowAll(false)} title="All photos" size="lg">
        <div className="grid gap-3 sm:grid-cols-2">
          {photos.map((photo, i) => (
            <div key={photo.id} className="relative aspect-[4/3] overflow-hidden rounded-xl">
              <GalleryImage
                src={photo.url}
                alt={photo.alt ?? `Photo ${i + 1}`}
              />
            </div>
          ))}
        </div>
      </Modal>

      {videos.length > 0 && (
        <div className="mt-10">
          <h2 className="font-serif text-xl">Video tour</h2>
          <div className="mt-4 space-y-6">
            {videos.map((video) => (
              <PropertyVideoPlayer
                key={video.id}
                playbackId={video.playbackId!}
                title={video.alt ?? `${propertyName} video tour`}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
