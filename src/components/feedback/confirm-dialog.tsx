"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { Icons } from "@/components/icons";

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  danger = false,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
}) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm">
      <p className="text-sm text-muted">{description}</p>
      <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row">
        <Button
          fullWidth
          variant={danger ? "danger" : "primary"}
          onClick={onConfirm}
        >
          {confirmLabel}
        </Button>
        <Button variant="outline" fullWidth onClick={onClose}>
          {cancelLabel}
        </Button>
      </div>
    </Modal>
  );
}

export function SuccessState({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-success" aria-hidden="true">
        <Icons.Check className="h-8 w-8" />
      </div>
      <h1 className="mt-6 font-serif text-3xl">{title}</h1>
      {description && <p className="mt-3 text-muted">{description}</p>}
      {children}
    </div>
  );
}
