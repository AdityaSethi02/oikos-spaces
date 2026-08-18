export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(typeof date === "string" ? new Date(date) : date);
}

export function formatDateRange(checkIn: string, checkOut: string): string {
  const inDate = new Date(checkIn);
  const outDate = new Date(checkOut);
  const sameMonth = inDate.getMonth() === outDate.getMonth();
  const inFmt = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
  });
  const outFmt = new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  if (sameMonth) {
    return `${inDate.getDate()} – ${outFmt.format(outDate)}`;
  }
  return `${inFmt.format(inDate)} – ${outFmt.format(outDate)}`;
}

export function calculateNights(checkIn: string, checkOut: string): number {
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  return Math.max(
    1,
    Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)),
  );
}

export function calculateBookingTotal(
  pricePerNight: number,
  nights: number,
  cleaningFee = 800,
  serviceFeeRate = 0.05,
  taxRate = 0.12,
) {
  const subtotal = pricePerNight * nights;
  const serviceFee = Math.round(subtotal * serviceFeeRate);
  const taxes = Math.round((subtotal + cleaningFee + serviceFee) * taxRate);
  const total = subtotal + cleaningFee + serviceFee + taxes;
  return { subtotal, cleaningFee, serviceFee, taxes, total, nights };
}
