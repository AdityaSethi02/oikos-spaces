import Link from "next/link";
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-foreground text-background hover:bg-foreground/90 focus-visible:ring-foreground",
  secondary:
    "bg-accent text-white hover:bg-accent/90 focus-visible:ring-accent",
  outline:
    "border border-border bg-surface text-foreground hover:bg-background focus-visible:ring-foreground",
  ghost:
    "text-foreground hover:bg-background focus-visible:ring-foreground",
  danger:
    "bg-error text-white hover:bg-error/90 focus-visible:ring-error",
};

const sizes: Record<ButtonSize, string> = {
  sm: "min-h-11 h-11 px-4 text-sm gap-1.5 sm:h-10 sm:min-h-10 sm:px-3.5",
  md: "min-h-11 h-11 px-5 text-sm gap-2",
  lg: "min-h-12 h-12 px-6 text-base gap-2",
};

export function buttonClasses({
  variant = "primary",
  size = "md",
  fullWidth,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
} = {}) {
  return cn(
    "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
    "touch-manipulation select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      fullWidth,
      disabled,
      type = "button",
      children,
      ...props
    },
    ref,
  ) => (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={buttonClasses({ variant, size, fullWidth, className })}
      {...props}
    >
      {children}
    </button>
  ),
);

Button.displayName = "Button";

interface ButtonLinkProps {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  className?: string;
  disabled?: boolean;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  disabled,
}: ButtonLinkProps) {
  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={buttonClasses({
          variant,
          size,
          fullWidth,
          className: cn("pointer-events-none opacity-50", className),
        })}
      >
        {children}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className={buttonClasses({ variant, size, fullWidth, className })}
    >
      {children}
    </Link>
  );
}
