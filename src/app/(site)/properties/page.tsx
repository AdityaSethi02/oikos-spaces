import { Suspense } from "react";
import { PropertiesContent } from "./properties-content";
import { PageLoading } from "@/components/feedback/page-loading";

export const metadata = { title: "Properties" };

export default function PropertiesPage() {
  return (
    <Suspense fallback={<PageLoading />}>
      <PropertiesContent />
    </Suspense>
  );
}
