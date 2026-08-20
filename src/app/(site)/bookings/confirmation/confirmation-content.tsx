"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";
import type { GuestBookingDto } from "@/server/dto/public.dto";

export default function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");
  const [booking, setBooking] = useState<GuestBookingDto | null>(null);
  const [loading, setLoading] = useState(Boolean(bookingId));

  useEffect(() => {
    if (!bookingId) return;
    fetch(`/api/bookings/${encodeURIComponent(bookingId)}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data: GuestBookingDto | null) => {
        setBooking(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [bookingId]);

  if (loading) {
    return <div className="section-padding text-center text-muted">Loading confirmation…</div>;
  }

  if (!bookingId || !booking) {
    return (
      <div className="section-padding">
        <div className="container-page max-w-lg text-center">
          <h1 className="font-serif text-3xl">Booking not found</h1>
          <p className="mt-3 text-muted">We couldn&apos;t load this confirmation.</p>
          <ButtonLink href="/bookings" className="mt-8">My bookings</ButtonLink>
        </div>
      </div>
    );
  }

  const confirmed = booking.bookingStatus === "confirmed" || booking.paymentStatus === "paid";

  return (
    <div className="section-padding">
      <div className="container-page max-w-lg text-center">
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${confirmed ? "bg-green-50 text-success" : "bg-amber-50 text-warning"}`}>
          <Icons.Check className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-serif text-3xl">
          {confirmed ? "Booking confirmed!" : "Payment processing"}
        </h1>
        <p className="mt-3 text-muted">
          {confirmed
            ? "Your reservation is confirmed. We've queued a confirmation email."
            : "Your payment is being verified. Refresh this page in a moment or check My bookings."}
        </p>

        <Card className="mt-8 text-left">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Booking ID</p>
            <BookingStatusBadge status={booking.bookingStatus} />
          </div>
          <p className="mt-1 font-serif text-xl">#{booking.id}</p>
          <p className="mt-2 text-sm">{booking.property.name}</p>
          <p className="text-sm text-muted">{booking.checkIn} – {booking.checkOut}</p>
        </Card>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href={`/bookings/${booking.id}`} fullWidth className="sm:w-auto">
            View booking
          </ButtonLink>
          {booking.conversationId && (
            <ButtonLink href={`/messages/${booking.conversationId}`} variant="outline" fullWidth className="sm:w-auto">
              Message host
            </ButtonLink>
          )}
        </div>
      </div>
    </div>
  );
}
