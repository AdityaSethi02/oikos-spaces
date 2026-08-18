import { Suspense } from "react";
import { PageLoading } from "@/components/feedback/page-loading";
import PaymentContent from "./payment-content";

export const metadata = { title: "Payment" };

export async function generateStaticParams() {
  const { bookings } = await import("@/data/mock/bookings");
  return bookings.map((booking) => ({ id: booking.id }));
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<PageLoading label="Loading payment" />}>
      <PaymentContent />
    </Suspense>
  );
}
