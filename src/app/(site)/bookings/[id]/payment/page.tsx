import { Suspense } from "react";
import { PageLoading } from "@/components/feedback/page-loading";
import PaymentContent from "./payment-content";

export const metadata = { title: "Payment" };

export default function PaymentPage() {
  return (
    <Suspense fallback={<PageLoading label="Loading payment" />}>
      <PaymentContent />
    </Suspense>
  );
}
