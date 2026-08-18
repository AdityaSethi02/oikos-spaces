import { Suspense } from "react";
import { PageLoading } from "@/components/feedback/page-loading";
import ContactHostContent from "./contact-host-content";

export const metadata = { title: "Contact host" };

export async function generateStaticParams() {
  const { properties } = await import("@/data/mock/properties");
  return properties.map((property) => ({ slug: property.slug }));
}

export default function ContactHostPage() {
  return (
    <Suspense fallback={<PageLoading label="Loading inquiry" />}>
      <ContactHostContent />
    </Suspense>
  );
}
