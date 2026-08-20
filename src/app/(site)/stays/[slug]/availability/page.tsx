import { notFound } from "next/navigation";
import Link from "next/link";
import { BookingCard } from "@/components/booking/booking-card";
import { BookingFlowSkeleton } from "@/components/feedback/data-skeletons";
import { getPublicPropertyBySlug } from "@/server/services/property.service";
import { isDatabaseConfigured } from "@/lib/env";

export const dynamic = "force-dynamic";

export const metadata = { title: "Select dates" };

export default async function AvailabilityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  if (!isDatabaseConfigured) {
    return <BookingFlowSkeleton />;
  }

  const { slug } = await params;
  const property = await getPublicPropertyBySlug(slug);
  if (!property) notFound();

  return (
    <div className="section-padding">
      <div className="container-page max-w-2xl">
        <Link href={`/stays/${slug}`} className="text-sm text-muted hover:text-foreground">
          ← Back to {property.name}
        </Link>
        <h1 className="mt-4 font-serif text-3xl">Select dates</h1>
        <p className="mt-2 text-muted">
          Choose check-in and check-out to see availability and a price estimate. You won&apos;t be charged yet.
        </p>
        <div className="mt-8">
          <BookingCard property={property} sticky={false} />
        </div>
      </div>
    </div>
  );
}
