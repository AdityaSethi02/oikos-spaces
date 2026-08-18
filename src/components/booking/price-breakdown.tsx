import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PriceBreakdownProps {
  pricePerNight: number;
  nights: number;
  cleaningFee?: number;
  serviceFee?: number;
  taxes?: number;
  total?: number;
  className?: string;
}

export function PriceBreakdown({
  pricePerNight,
  nights,
  cleaningFee = 800,
  serviceFee,
  taxes,
  total,
  className,
}: PriceBreakdownProps) {
  const subtotal = pricePerNight * nights;
  const computedServiceFee = serviceFee ?? Math.round(subtotal * 0.05);
  const computedTaxes =
    taxes ?? Math.round((subtotal + cleaningFee + computedServiceFee) * 0.12);
  const computedTotal =
    total ?? subtotal + cleaningFee + computedServiceFee + computedTaxes;

  const rows = [
    {
      label: `${formatCurrency(pricePerNight)} × ${nights} night${nights !== 1 ? "s" : ""}`,
      value: formatCurrency(subtotal),
    },
    { label: "Cleaning fee", value: formatCurrency(cleaningFee) },
    { label: "Service fee", value: formatCurrency(computedServiceFee) },
    { label: "Taxes & charges", value: formatCurrency(computedTaxes) },
  ];

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
