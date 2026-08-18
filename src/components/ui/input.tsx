import { cn } from "@/lib/utils";
import { type InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, hint, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "flex h-11 w-full rounded-lg border border-border bg-surface px-3.5 text-sm",
            "placeholder:text-muted-foreground transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:border-foreground/30",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-error focus-visible:ring-error/20",
            className,
          )}
          {...props}
        />
        {error && <p className="text-sm text-error">{error}</p>}
        {hint && !error && (
          <p className="text-sm text-muted">{hint}</p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
