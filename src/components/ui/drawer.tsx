"use client";

import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "left" | "right";
  className?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
  className,
}: DrawerProps) {
  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "absolute top-0 flex h-full w-full max-w-sm flex-col bg-surface shadow-xl",
          side === "right" ? "right-0" : "left-0",
          className,
        )}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          {title && <h2 className="font-serif text-lg">{title}</h2>}
          <button
            onClick={onClose}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-muted hover:bg-background"
            aria-label="Close menu"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
