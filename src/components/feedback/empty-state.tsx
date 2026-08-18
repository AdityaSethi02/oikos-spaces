import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
  icon,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface px-6 py-16 text-center",
        className,
      )}
    >
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-light text-2xl">
          {icon}
        </div>
      )}
      <h3 className="font-serif text-xl text-foreground">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-muted">{description}</p>
      )}
      {actionLabel && actionHref && (
        <Link href={actionHref} className="mt-6">
          <Button>{actionLabel}</Button>
        </Link>
      )}
      {actionLabel && onAction && !actionHref && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-stone-200/60",
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again later.",
  onRetry,
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
}) {
  return (
    <EmptyState
      title={title}
      description={description}
      icon="⚠️"
      actionLabel={onRetry ? "Try again" : undefined}
      onAction={onRetry}
    />
  );
}
