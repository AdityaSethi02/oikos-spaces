"use client";

import { useSearchParams } from "next/navigation";
import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/ui/badge";
import { Icons } from "@/components/icons";

export default function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id") || "BK123456";

  return (
    <div className="section-padding">
      <div className="container-page max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-success">
          <Icons.Check className="h-8 w-8" />
        </div>
        <h1 className="mt-6 font-serif text-3xl">Booking confirmed!</h1>
        <p className="mt-3 text-muted">
          Your reservation has been confirmed. We&apos;ve sent a confirmation email (demo).
        </p>

        <Card className="mt-8 text-left">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted">Booking ID</p>
            <BookingStatusBadge status="confirmed" />
          </div>
          <p className="mt-1 font-serif text-xl">#{bookingId}</p>
          <p className="mt-4 text-sm text-muted">
            Check-in details and access instructions will be shared closer to your arrival date.
          </p>
        </Card>

        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
          <ButtonLink href={`/bookings/${bookingId}`} fullWidth className="sm:w-auto">
            View booking
          </ButtonLink>
          <ButtonLink href="/messages/conv-2" variant="outline" fullWidth className="sm:w-auto">
            Message host
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
