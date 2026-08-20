"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import {
  deleteMediaAction,
  finishMediaUploadAction,
  setFeaturedMediaAction,
  startMediaUploadAction,
} from "@/app/actions/property.actions";
import { PropertyVideoPlayer } from "@/components/media/property-video-player";
import { useToast } from "@/components/providers/toast-provider";
import type { PropertyMediaItem } from "@/server/dto/domain.dto";
import { cn } from "@/lib/utils";

export function PropertyMediaManager({
  propertyId,
  media: initialMedia = [],
}: {
  propertyId: string;
  media?: PropertyMediaItem[];
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  async function uploadFiles(files: FileList | null) {
    if (!files?.length) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      const kind = file.type.startsWith("video/") ? "VIDEO" : "PHOTO";
      const started = await startMediaUploadAction({
        propertyId,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        kind,
      });

      if (!started.ok) {
        showToast(started.error, "error");
        continue;
      }

      const response = await fetch(started.uploadUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!response.ok) {
        showToast("Upload to storage failed", "error");
        continue;
      }

      const finished = await finishMediaUploadAction(started.mediaId);
      if (!finished.ok) {
        showToast(finished.error, "error");
      } else if (kind === "VIDEO") {
        showToast("Video uploaded — processing may take a minute", "success");
      } else {
        showToast("Photo uploaded", "success");
      }
    }

    setUploading(false);
    router.refresh();
  }

  async function handleDelete(mediaId: string) {
    const result = await deleteMediaAction(mediaId);
    if (result.ok) {
      showToast("Media removed", "info");
      router.refresh();
    } else {
      showToast(result.error, "error");
    }
  }

  async function handleSetFeatured(mediaId: string) {
    const result = await setFeaturedMediaAction({ propertyId, mediaId });
    if (result.ok) {
      showToast("Cover photo updated", "success");
      router.refresh();
    } else {
      showToast(result.error, "error");
    }
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime"
        multiple
        className="hidden"
        onChange={(e) => {
          void uploadFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <div
        className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          void uploadFiles(e.dataTransfer.files);
        }}
      >
        {initialMedia.map((item) => (
          <div key={item.id} className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-stone-100">
            {item.kind === "PHOTO" ? (
              <Image src={item.url} alt={item.alt ?? "Property photo"} fill className="object-cover" sizes="200px" />
            ) : item.playbackId ? (
              <PropertyVideoPlayer
                playbackId={item.playbackId}
                title={item.alt ?? "Property video"}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center bg-stone-200 px-2 text-center text-sm text-muted">
                Video processing…
              </div>
            )}
            {item.isFeatured && (
              <span className="absolute left-2 top-2 rounded bg-accent px-2 py-0.5 text-xs text-white">Cover</span>
            )}
            <div className="absolute inset-x-0 bottom-0 flex gap-1 bg-black/60 p-2 opacity-0 transition-opacity group-hover:opacity-100">
              {item.kind === "PHOTO" && !item.isFeatured && (
                <button
                  type="button"
                  className="flex-1 rounded bg-white/90 px-2 py-1 text-xs"
                  onClick={() => void handleSetFeatured(item.id)}
                >
                  Set cover
                </button>
              )}
              <button
                type="button"
                className="flex-1 rounded bg-red-500/90 px-2 py-1 text-xs text-white"
                onClick={() => void handleDelete(item.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className={cn(
            "flex aspect-square flex-col items-center justify-center rounded-xl border-2 border-dashed border-border text-sm text-muted transition-colors hover:border-accent hover:text-accent",
            uploading && "pointer-events-none opacity-60",
          )}
        >
          {uploading ? "Uploading…" : "+ Add photo or video"}
        </button>
      </div>

      <p className="mt-3 text-xs text-muted">
        Photos up to 10 MB (JPEG, PNG, WebP) via R2. Videos up to 200 MB (MP4, MOV) via Mux when configured.
      </p>
    </div>
  );
}
