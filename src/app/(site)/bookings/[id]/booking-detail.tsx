"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { PropertyThumbnail } from "@/components/media/property-thumbnail";
import { PriceBreakdown } from "@/components/booking/price-breakdown";
import { UploadDocument } from "@/components/forms/upload-document";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { ErrorState } from "@/components/feedback/empty-state";
import type { GuestBookingDto } from "@/server/dto/public.dto";
import { formatDateRange } from "@/lib/utils";
import { useToast } from "@/components/providers/toast-provider";
import { cancelBookingAction } from "@/app/actions/booking.actions";
import { submitReviewAction } from "@/app/actions/review.actions";
import { uploadGuestDocument } from "@/lib/upload-guest-document";
import { Textarea } from "@/components/ui/textarea";

export function BookingDetail({ booking }: { booking: GuestBookingDto }) {
  const property = booking.property;
  const router = useRouter();
  const { showToast } = useToast();
  const [cancelOpen, setCancelOpen] = useState(false);

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
                <div className="relative w-24 shrink-0 aspect-square overflow-hidden rounded-lg">
                  <PropertyThumbnail property={property} className="absolute inset-0 rounded-lg" sizes="96px" />
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
                  <p className="text-muted">Access instructions will be shared 24 hours before arrival.</p>
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
                <ButtonLink href="/messages" fullWidth className="mt-4">
                  Contact host
                </ButtonLink>
              </Card>
            )}

            {isAfter && (
              <Card>
                <h2 className="font-serif text-lg">Stay completed</h2>
                <p className="mt-3 text-sm text-muted">
                  Check-out is confirmed. Thank you for staying with us.
                </p>
                {booking.hasReview ? (
                  <p className="mt-4 text-sm">Your review has been submitted.</p>
                ) : booking.canReview ? (
                  <form
                    className="mt-4 space-y-3"
                    action={async (formData) => {
                      const result = await submitReviewAction({
                        bookingReference: booking.id,
                        rating: Number(formData.get("rating") ?? 5),
                        comment: String(formData.get("comment") ?? ""),
                      });
                      if (result.ok) {
                        showToast("Review submitted for host approval", "success");
                        router.refresh();
                      } else {
                        showToast(result.error, "error");
                      }
                    }}
                  >
                    <label className="block text-sm font-medium">Rating</label>
                    <select name="rating" className="search-input" defaultValue="5">
                      {[5, 4, 3, 2, 1].map((value) => (
                        <option key={value} value={value}>
                          {value} stars
                        </option>
                      ))}
                    </select>
                    <Textarea name="comment" label="Your review" rows={4} required />
                    <Button type="submit" fullWidth>
                      Submit review
                    </Button>
                  </form>
                ) : (
                  <ButtonLink href={`/stays/${property.slug}#reviews`} fullWidth className="mt-4">
                    Read reviews
                  </ButtonLink>
                )}
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
              <UploadDocument
                onUpload={async (file) => {
                  const result = await uploadGuestDocument({
                    file,
                    bookingReference: booking.id,
                    conversationId: booking.conversationId,
                  });
                  if (!result.ok) {
                    showToast(result.error, "error");
                    throw new Error(result.error);
                  }
                }}
              />
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <h2 className="font-serif text-lg">Price breakdown</h2>
              <div className="mt-4">
                <PriceBreakdown snapshot={booking.quote.snapshot} />
              </div>
            </Card>

            <div className="flex flex-col gap-3">
              <ButtonLink href={booking.conversationId ? `/messages/${booking.conversationId}` : "/messages"} fullWidth>
                Message host
              </ButtonLink>
              <ButtonLink
                href={`/api/bookings/${booking.id}/invoice`}
                variant="outline"
                fullWidth
                disabled={!["paid", "partially_refunded", "refunded"].includes(booking.paymentStatus)}
              >
                Download invoice
              </ButtonLink>
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
        description="Cancellation policy for this stay will apply."
        confirmLabel="Cancel booking"
        onConfirm={async () => {
          const result = await cancelBookingAction(booking.id);
          if (result.ok) {
            showToast("Booking cancelled", "info");
            router.refresh();
          } else {
            showToast(result.error, "error");
          }
          setCancelOpen(false);
        }}
      />
    </div>
  );
}
