"use client";

import { useState } from "react";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

interface PropertyImageProps {
  src?: string;
  alt: string;
  className?: string;
  /** Fill parent (absolute inset) vs natural flow */
  fill?: boolean;
  priority?: boolean;
}

export function PropertyImage({
  src,
  alt,
  className,
  fill = true,
  priority = false,
}: PropertyImageProps) {
  const [failed, setFailed] = useState(false);
  const showImage = Boolean(src) && !failed;

  return (
    <div
      className={cn(
        "relative overflow-hidden bg-gradient-to-br from-stone-100 via-stone-50 to-accent-light/30",
        fill && "h-full w-full",
        className,
      )}
      role="img"
      aria-label={alt}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover"
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-muted">
          <Icons.House className="h-7 w-7 opacity-50" aria-hidden />
          <span className="text-xs font-medium tracking-wide uppercase">{alt}</span>
        </div>
      )}
    </div>
  );
}
