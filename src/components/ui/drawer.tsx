"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState, type ReactNode } from "react";
import { Icons } from "@/components/icons";

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  side?: "left" | "right";
  /** Stretch to full viewport width (mobile nav). */
  fullWidth?: boolean;
  className?: string;
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  side = "right",
  fullWidth = false,
  className,
}: DrawerProps) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);
  const [prevOpen, setPrevOpen] = useState(open);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setMounted(true);
      setVisible(false);
    } else {
      setVisible(false);
    }
  }

  useEffect(() => {
    if (!open || !mounted) return;
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setVisible(true));
    });
    return () => cancelAnimationFrame(id);
  }, [open, mounted]);

  useEffect(() => {
    if (open || !mounted) return;
    const timeout = window.setTimeout(() => setMounted(false), 280);
    return () => window.clearTimeout(timeout);
  }, [open, mounted]);

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

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div
        className={cn(
          "absolute inset-0 bg-black/40 transition-opacity ease-out",
          visible ? "opacity-100" : "opacity-0",
        )}
        style={{ transitionDuration: "280ms" }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          "absolute top-0 flex h-dvh w-full flex-col shadow-xl transition-transform ease-out",
          "pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]",
          fullWidth ? "max-w-none" : "max-w-sm",
          side === "right" ? "right-0" : "left-0",
          visible
            ? "translate-x-0"
            : side === "right"
              ? "translate-x-full"
              : "-translate-x-full",
          className ?? "bg-surface text-foreground",
        )}
        style={{ transitionDuration: "280ms" }}
      >
        <div className="container-page flex h-16 items-center justify-between gap-3 border-b border-current/10 lg:h-[4.5rem]">
          {title && (
            <h2 className="font-serif text-lg tracking-wide sm:text-xl">{title}</h2>
          )}
          <button
            type="button"
            onClick={onClose}
            className="ml-auto flex h-11 w-11 items-center justify-center rounded-lg opacity-70 transition-opacity touch-manipulation hover:bg-current/10 hover:opacity-100"
            aria-label="Close menu"
          >
            <Icons.Close className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
      </div>
    </div>
  );
}
