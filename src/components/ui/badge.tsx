import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "success"
  | "warning"
  | "error"
  | "info"
  | "neutral";

const variants: Record<BadgeVariant, string> = {
  default: "bg-accent-light text-accent",
  success: "bg-green-50 text-success",
  warning: "bg-amber-50 text-warning",
  error: "bg-red-50 text-error",
  info: "bg-blue-50 text-info",
  neutral: "bg-stone-100 text-muted",
};

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function BookingStatusBadge({
  status,
}: {
  status: string;
}) {
  const config: Record<string, { label: string; variant: BadgeVariant }> = {
    reserved: { label: "Reserved", variant: "info" },
    payment_pending: { label: "Payment Pending", variant: "warning" },
    confirmed: { label: "Confirmed", variant: "success" },
    checked_in: { label: "Checked In", variant: "success" },
    checked_out: { label: "Completed", variant: "neutral" },
    cancelled: { label: "Cancelled", variant: "error" },
    expired: { label: "Expired", variant: "neutral" },
  };

  const { label, variant } = config[status] || {
    label: status,
    variant: "neutral" as BadgeVariant,
  };

  return <Badge variant={variant}>{label}</Badge>;
}

export function PaymentStatusBadge({
  status,
}: {
  status: string;
}) {
  const config: Record<string, { label: string; variant: BadgeVariant }> = {
    pending: { label: "Pending", variant: "warning" },
    paid: { label: "Paid", variant: "success" },
    failed: { label: "Failed", variant: "error" },
    refunded: { label: "Refunded", variant: "neutral" },
    partially_refunded: { label: "Partial Refund", variant: "info" },
  };

  const { label, variant } = config[status] || {
    label: status,
    variant: "neutral" as BadgeVariant,
  };

  return <Badge variant={variant}>{label}</Badge>;
}
