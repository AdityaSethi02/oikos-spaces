"use client";

import MuxPlayer from "@mux/mux-player-react";

export function PropertyVideoPlayer({
  playbackId,
  title,
  className,
}: {
  playbackId: string;
  title: string;
  className?: string;
}) {
  return (
    <MuxPlayer
      playbackId={playbackId}
      metadata={{ video_title: title }}
      className={className ?? "aspect-video w-full rounded-xl"}
      accentColor="#A67C52"
    />
  );
}
