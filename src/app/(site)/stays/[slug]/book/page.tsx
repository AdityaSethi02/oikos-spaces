import { Suspense } from "react";
import { PageLoading } from "@/components/feedback/page-loading";
import BookContent from "./book-content";

export const metadata = { title: "Checkout" };

export default function BookPage() {
  return (
    <Suspense fallback={<PageLoading label="Loading checkout" />}>
      <BookContent />
    </Suspense>
  );
}
