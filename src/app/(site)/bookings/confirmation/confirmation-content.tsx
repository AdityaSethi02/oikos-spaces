"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookingStatusBadge } from "@/components/ui/badge";

export default function BookingConfirmationContent() {
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id") || "BK123456";

  return (
    <div className="section-padding">
      <div className="container-page max-w-lg text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-50 text-3xl text-success">
          ✓
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

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={`/bookings/${bookingId}`}>
            <Button fullWidth>View booking</Button>
          </Link>
          <Link href="/messages/conv-2">
            <Button variant="outline" fullWidth>Message host</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
