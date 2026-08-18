"use client";

import { useToast } from "@/components/providers/toast-provider";
import { cn } from "@/lib/utils";

export function ToastContainer() {
  const { toasts, dismissToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 sm:bottom-6 sm:right-6"
      aria-live="polite"
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 rounded-lg border px-4 py-3 shadow-lg min-w-[280px] max-w-sm",
            toast.type === "success" && "border-green-200 bg-green-50 text-success",
            toast.type === "error" && "border-red-200 bg-red-50 text-error",
            toast.type === "info" && "border-blue-200 bg-blue-50 text-info",
          )}
        >
          <span className="flex-1 text-sm font-medium">{toast.message}</span>
          <button
            onClick={() => dismissToast(toast.id)}
            className="text-current opacity-60 hover:opacity-100"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
