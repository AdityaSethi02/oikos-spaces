"use client";

import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import { Icons } from "@/components/icons";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeMap = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({
  open,
  onClose,
  title,
  children,
  className,
  size = "md",
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      className={cn(
        "fixed inset-0 z-50 m-auto max-h-[min(90dvh,90vh)] w-[calc(100%-2rem)] overflow-hidden rounded-xl border border-border bg-surface p-0 shadow-xl backdrop:bg-black/40",
        sizeMap[size],
        className,
      )}
    >
      <div className="flex items-center justify-between border-b border-border px-4 py-3 sm:px-5 sm:py-4">
        <h2 className="font-serif text-lg">{title}</h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-muted hover:bg-background hover:text-foreground"
          aria-label="Close dialog"
        >
          <Icons.Close className="h-5 w-5" />
        </button>
      </div>
      <div className="max-h-[calc(min(90dvh,90vh)-4.5rem)] overflow-y-auto overscroll-contain p-4 sm:p-5">
        {children}
      </div>
    </dialog>
  );
}
