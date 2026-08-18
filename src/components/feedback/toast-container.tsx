"use client";

import { useToast } from "@/components/providers/toast-provider";
import { Icons } from "@/components/icons";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed inset-x-4 top-[calc(4rem+0.75rem)] z-[100] flex flex-col gap-2 sm:inset-x-auto sm:top-auto sm:right-6 sm:bottom-6"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg w-full max-w-sm sm:min-w-[280px]",
            toast.type === "success" && "border-green-200 bg-green-50 text-success",
            toast.type === "error" && "border-red-200 bg-red-50 text-error",
            toast.type === "info" && "border-blue-200 bg-blue-50 text-info",
          )}
        >
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          <button
            type="button"
            onClick={() => dismissToast(toast.id)}
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-current opacity-60 hover:opacity-100"
            aria-label="Dismiss"
          >
            <Icons.Close className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
