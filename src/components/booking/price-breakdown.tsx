import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";
import type { PricingSnapshot } from "@/server/dto/public.dto";
import { paiseToRupees } from "@/server/lib/money";

interface PriceBreakdownProps {
  pricePerNight?: number;
  nights?: number;
  cleaningFee?: number;
  serviceFee?: number;
  taxes?: number;
  total?: number;
  snapshot?: PricingSnapshot;
  className?: string;
}

export function PriceBreakdown({
  pricePerNight = 0,
  nights = 1,
  cleaningFee = 0,
  serviceFee,
  taxes,
  total,
  snapshot,
  className,
}: PriceBreakdownProps) {
  const rows = snapshot
    ? snapshot.lineItems.map((item) => ({
        label: item.label,
        value: formatCurrency(paiseToRupees(item.amountPaise)),
      }))
    : [
        {
          label: `${formatCurrency(pricePerNight)} × ${nights} night${nights !== 1 ? "s" : ""}`,
          value: formatCurrency(pricePerNight * nights),
        },
        { label: "Cleaning fee", value: formatCurrency(cleaningFee) },
        { label: "Service fee", value: formatCurrency(serviceFee ?? 0) },
        { label: "Taxes & charges", value: formatCurrency(taxes ?? 0) },
      ];

  const computedTotal = snapshot
    ? paiseToRupees(snapshot.totalPaise)
    : (total ??
      pricePerNight * nights +
        cleaningFee +
        (serviceFee ?? 0) +
        (taxes ?? 0));

  return (
    <div className={cn("space-y-3", className)}>
      {rows.map((row) => (
        <div key={row.label} className="flex justify-between text-sm">
          <span className="text-muted underline decoration-dotted underline-offset-2">
            {row.label}
          </span>
          <span className="text-foreground">{row.value}</span>
        </div>
      ))}
      <hr className="border-border" />
      <div className="flex justify-between font-semibold text-foreground">
        <span>Total</span>
        <span>{formatCurrency(computedTotal)}</span>
      </div>
    </div>
  );
}
