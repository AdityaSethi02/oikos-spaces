import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageLoading } from "@/components/feedback/page-loading";
import { BookingFlowSkeleton } from "@/components/feedback/data-skeletons";
import { getPublicPropertyBySlug, getStayQuote } from "@/server/services/property.service";
import { isDatabaseConfigured } from "@/lib/env";
import BookContent from "./book-content";

export const dynamic = "force-dynamic";

export const metadata = { title: "Checkout" };

export default async function BookPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>;
}) {
  if (!isDatabaseConfigured) {
    return <BookingFlowSkeleton />;
  }

  const { slug } = await params;
  const query = await searchParams;
  const property = await getPublicPropertyBySlug(slug);
  if (!property) notFound();

  const checkIn = query.checkIn || "2026-09-15";
  const checkOut = query.checkOut || "2026-09-18";
  const guests = Number(query.guests || 2);
  const quote = await getStayQuote({ slug, checkIn, checkOut, guests }).catch(() => null);

  return (
    <Suspense fallback={<PageLoading label="Loading checkout" />}>
      <BookContent property={property} quote={quote} />
    </Suspense>
  );
}
