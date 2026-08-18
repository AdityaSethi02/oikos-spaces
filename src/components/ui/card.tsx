import { cn } from "@/lib/utils";
import { type HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
};

export function Card({
  className,
  padding = "md",
  hover,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-surface shadow-soft",
        paddingMap[padding],
        hover && "transition-shadow hover:shadow-md",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
