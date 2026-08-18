"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { PriceBreakdown } from "@/components/booking/price-breakdown";
import { UploadDocument } from "@/components/forms/upload-document";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { ErrorState } from "@/components/feedback/empty-state";
import { getBookingById } from "@/data/mock/bookings";
import { getPropertyById } from "@/data/mock/properties";
import { calculateNights, formatDateRange } from "@/lib/utils";
import { useToast } from "@/components/providers/toast-provider";

export default function BookingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const booking = getBookingById(id);
  const router = useRouter();
  const { showToast } = useToast();
  const [cancelOpen, setCancelOpen] = useState(false);

  if (!booking) {
    return (
      <div className="container-page section-padding">
        <ErrorState title="Booking not found" description="This booking ID is not in the demo data." />
      </div>
    );
  }

  const property = getPropertyById(booking.propertyId);
  if (!property) {
    return (
      <div className="container-page section-padding">
        <ErrorState title="Property missing" />
      </div>
    );
  }

  const nights = calculateNights(booking.checkIn, booking.checkOut);
  const isExpired = booking.bookingStatus === "expired" || booking.paymentStatus === "failed";
  const isDuring = booking.bookingStatus === "checked_in";
  const isAfter = booking.bookingStatus === "checked_out";
  const isBefore = !isDuring && !isAfter && booking.bookingStatus !== "cancelled" && !isExpired;

  return (
    <div className="section-padding">
      <div className="container-page max-w-4xl">
        <Link href="/bookings" className="text-sm text-muted hover:text-foreground">
          ← All bookings
        </Link>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <h1 className="font-serif text-3xl">Booking #{booking.id}</h1>
          <BookingStatusBadge status={booking.bookingStatus} />
          <PaymentStatusBadge status={booking.paymentStatus} />
        </div>

        {isExpired && (
          <div className="mt-6">
            <ErrorState
              title={booking.paymentStatus === "failed" ? "Payment failed" : "Booking expired"}
              description="This reservation is no longer active. You can start a new booking."
              onRetry={() => router.push(`/stays/${property.slug}`)}
            />
          </div>
        )}

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <div className="flex gap-4">
                <div className="w-24 shrink-0 overflow-hidden rounded-lg">
                  <ImagePlaceholder variant="property" className="rounded-lg" />
                </div>
                <div>
                  <Link href={`/stays/${property.slug}`} className="font-serif text-xl hover:text-accent">
                    {property.name}
                  </Link>
                  <p className="mt-1 text-sm text-muted">{property.location}</p>
                </div>
              </div>
              <div className="mt-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Dates</span>
                  <span>{formatDateRange(booking.checkIn, booking.checkOut)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Guests</span>
                  <span>{booking.guests}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Payment</span>
                  <span className="capitalize">{booking.paymentMethod}</span>
                </div>
              </div>
            </Card>

            {isBefore && (
              <Card>
                <h2 className="font-serif text-lg">Before check-in</h2>
                <div className="mt-4 space-y-3 text-sm">
                  <p><span className="text-muted">Check-in:</span> {booking.checkIn} after {property.checkIn}</p>
                  <p><span className="text-muted">Check-out:</span> {booking.checkOut} by {property.checkOut}</p>
                  <p><span className="text-muted">Address:</span> {property.address}</p>
                  <p className="text-muted">Access instructions will be shared 24 hours before arrival (demo).</p>
                  <p><span className="text-muted">Required documents:</span> Government-issued ID</p>
                </div>
              </Card>
            )}

            {isDuring && (
              <Card>
                <h2 className="font-serif text-lg">During your stay</h2>
                <p className="mt-3 text-sm text-muted">
                  You are currently checked in. Contact your host anytime if you need help.
                </p>
                <Link href="/messages/conv-2" className="mt-4 block">
                  <Button fullWidth>Contact host</Button>
                </Link>
              </Card>
            )}

            {isAfter && (
              <Card>
                <h2 className="font-serif text-lg">Stay completed</h2>
                <p className="mt-3 text-sm text-muted">
                  Check-out is confirmed. Thank you for staying with us.
                </p>
                <Link href={`/stays/${property.slug}#reviews`} className="mt-4 block">
                  <Button fullWidth>Write a review</Button>
                </Link>
              </Card>
            )}

            <Card>
              <h2 className="font-serif text-lg">House rules</h2>
              <ul className="mt-4 space-y-1">
                {property.houseRules.map((r) => (
                  <li key={r} className="text-sm text-muted">· {r}</li>
                ))}
              </ul>
            </Card>

            <Card id="documents">
              <UploadDocument />
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="font-serif text-lg">Price breakdown</h2>
              <div className="mt-4">
                <PriceBreakdown
                  pricePerNight={property.pricePerNight}
                  nights={nights}
                  cleaningFee={property.cleaningFee}
                />
              </div>
            </Card>

            <div className="flex flex-col gap-3">
              <Link href="/messages/conv-2">
                <Button fullWidth>Message host</Button>
              </Link>
              <Button variant="outline" fullWidth onClick={() => showToast("Invoice downloaded (demo)", "success")}>
                Download invoice
              </Button>
              {booking.bookingStatus === "confirmed" && (
                <Button variant="ghost" fullWidth className="text-error" onClick={() => setCancelOpen(true)}>
                  Cancel booking
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        danger
        title="Cancel this booking?"
        description="This is a demo cancellation. Real policy will apply later."
        confirmLabel="Cancel booking"
        onConfirm={() => {
          showToast("Booking cancelled (demo)", "info");
          setCancelOpen(false);
        }}
      />
    </div>
  );
}
