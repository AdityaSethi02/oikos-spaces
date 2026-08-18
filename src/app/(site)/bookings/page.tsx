"use client";

import Link from "next/link";
import { useState } from "react";
import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/empty-state";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import {
  getUpcomingBookings,
  getCompletedBookings,
  getCancelledBookings,
} from "@/data/mock/bookings";
import { formatCurrency, formatDateRange } from "@/lib/utils";
import { useToast } from "@/components/providers/toast-provider";

type Tab = "upcoming" | "completed" | "cancelled";

export default function BookingsPage() {
  const [tab, setTab] = useState<Tab>("upcoming");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const { showToast } = useToast();

  const tabs: { key: Tab; label: string; data: ReturnType<typeof getUpcomingBookings> }[] = [
    { key: "upcoming", label: "Upcoming", data: getUpcomingBookings() },
    { key: "completed", label: "Completed", data: getCompletedBookings() },
    { key: "cancelled", label: "Cancelled", data: getCancelledBookings() },
  ];

  const active = tabs.find((t) => t.key === tab)!;

  return (
    <div className="section-padding">
      <div className="container-page">
        <h1 className="font-serif text-3xl">My bookings</h1>

        <div className="mt-6 flex gap-2 overflow-x-auto border-b border-border">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`shrink-0 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                tab === t.key
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted hover:text-foreground"
              }`}
            >
              {t.label} ({t.data.length})
            </button>
          ))}
        </div>

        {active.data.length === 0 ? (
          <EmptyState
            className="mt-10"
            title={`No ${tab} bookings`}
            description="When you book a stay, it will appear here."
            actionLabel="Explore stays"
            actionHref="/stays"
          />
        ) : (
          <div className="mt-8 space-y-4">
            {active.data.map((booking) => (
              <div
                key={booking.id}
                className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center sm:p-5"
              >
                <div className="w-full shrink-0 overflow-hidden rounded-lg sm:w-32">
                  <ImagePlaceholder variant="property" className="rounded-lg min-h-[100px]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-serif text-lg">{booking.property.name}</h3>
                    <BookingStatusBadge status={booking.bookingStatus} />
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {formatDateRange(booking.checkIn, booking.checkOut)} · {booking.guests} guests
                  </p>
                  <p className="mt-1 text-sm text-muted">#{booking.id}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <span className="font-medium">{formatCurrency(booking.amount)}</span>
                    <PaymentStatusBadge status={booking.paymentStatus} />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 sm:w-44 sm:flex-col">
                  <Link href={`/bookings/${booking.id}`}>
                    <Button variant="outline" size="sm" fullWidth>View booking</Button>
                  </Link>
                  <Link href="/messages/conv-2">
                    <Button variant="ghost" size="sm" fullWidth>Message host</Button>
                  </Link>
                  {(booking.bookingStatus === "payment_pending" || booking.bookingStatus === "confirmed") && (
                    <Link href={`/bookings/${booking.id}#documents`}>
                      <Button variant="ghost" size="sm" fullWidth>View / upload ID</Button>
                    </Link>
                  )}
                  {booking.bookingStatus === "confirmed" && (
                    <Button variant="ghost" size="sm" fullWidth className="text-error" onClick={() => setCancelId(booking.id)}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={!!cancelId}
        onClose={() => setCancelId(null)}
        danger
        title="Cancel booking?"
        description="This demo will mark the booking as cancelled. Cancellation policy applies."
        confirmLabel="Cancel booking"
        onConfirm={() => {
          showToast("Booking cancelled (demo)", "info");
          setCancelId(null);
        }}
      />
    </div>
  );
}
