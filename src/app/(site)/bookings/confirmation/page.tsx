import { Suspense } from "react";
import BookingConfirmationContent from "./confirmation-content";

export default function BookingConfirmationPage() {
  return (
    <Suspense fallback={<div className="container-page section-padding text-center">Loading…</div>}>
      <BookingConfirmationContent />
    </Suspense>
  );
}
