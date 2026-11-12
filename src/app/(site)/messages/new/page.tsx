import { Suspense } from "react";
import { PageLoading } from "@/components/feedback/page-loading";
import { NewEnquiryContent } from "./new-enquiry-content";

export const metadata = { title: "Message dealer" };

export default function NewEnquiryPage() {
  return (
    <Suspense fallback={<PageLoading label="Opening chat" />}>
      <NewEnquiryContent />
    </Suspense>
  );
}
