import Link from "next/link";
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes, type ReactNode, forwardRef } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "inverse";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent",
  secondary:
    "bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-accent",
  outline:
    "border border-border bg-surface text-foreground hover:bg-background focus-visible:ring-foreground",
  ghost:
    "text-foreground hover:bg-background focus-visible:ring-foreground",
  danger:
    "bg-error text-white hover:bg-error/90 focus-visible:ring-error",
  /** For dark backgrounds — light border + light text */
  inverse:
    "border border-white/40 bg-transparent text-white hover:bg-white/10 focus-visible:ring-white",
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
    "inline-flex cursor-pointer items-center justify-center rounded-lg font-medium transition-[color,background-color,border-color,box-shadow]",
    "touch-manipulation select-none",
    /* Scale only on devices with real hover — active:scale cancels taps on many phones */
    "[@media(hover:hover)_and_(pointer:fine)]:active:scale-[0.98]",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
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
  target?: string;
  rel?: string;
  onClick?: () => void;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  size = "md",
  fullWidth,
  className,
  disabled,
  target,
  rel,
  onClick,
}: ButtonLinkProps) {
  const classes = buttonClasses({ variant, size, fullWidth, className });

  if (disabled) {
    return (
      <span
        aria-disabled="true"
        className={cn(classes, "pointer-events-none cursor-not-allowed opacity-50")}
      >
        {children}
      </span>
    );
  }

  const external = /^https?:\/\//.test(href) || href.startsWith("tel:");
  if (external) {
    return (
      <a href={href} className={classes} target={target} rel={rel} onClick={onClick}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} target={target} rel={rel} onClick={onClick}>
      {children}
    </Link>
  );
}
