"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { BookingCard } from "@/components/booking/booking-card";
import { getPropertyBySlug } from "@/data/mock/properties";

export default function AvailabilityPage() {
  const params = useParams();
  const slug = params.slug as string;
  const property = getPropertyBySlug(slug);

  if (!property) {
    return (
      <div className="container-page section-padding">
        <p>Property not found</p>
      </div>
    );
  }

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
