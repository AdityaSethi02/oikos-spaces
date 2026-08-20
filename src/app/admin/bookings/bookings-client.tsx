"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookingStatusBadge, PaymentStatusBadge } from "@/components/ui/badge";
import { Button, ButtonLink } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/feedback/confirm-dialog";
import { Modal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import type { Property } from "@/server/dto/domain.dto";
import type { GuestBookingDto } from "@/server/dto/public.dto";
import { formatCurrency } from "@/lib/utils";
import { useToast } from "@/components/providers/toast-provider";
import { confirmDirectPaymentAction } from "@/app/actions/payment.actions";
import { adminUpdateBookingStatusAction, blockDatesAction } from "@/app/actions/booking.actions";

export function AdminBookingsClient({
  bookings,
  properties,
}: {
  bookings: GuestBookingDto[];
  properties: Property[];
}) {
  const { showToast } = useToast();
  const router = useRouter();
  const [action, setAction] = useState<{ type: string; id: string } | null>(null);
  const [blockOpen, setBlockOpen] = useState(false);

  const Actions = ({ id, pending, compact }: { id: string; pending: boolean; compact?: boolean }) => (
    <div className={compact ? "mt-3 grid grid-cols-2 gap-2" : "flex flex-wrap gap-1"}>
      <ButtonLink href={`/bookings/${id}`} variant="ghost" size="sm" fullWidth={compact}>View</ButtonLink>
      <ButtonLink href="/admin/messages" variant="ghost" size="sm" fullWidth={compact}>Message</ButtonLink>
      {pending && (
        <Button variant="ghost" size="sm" fullWidth={compact} onClick={() => setAction({ type: "pay", id })}>Mark paid</Button>
      )}
      <Button variant="ghost" size="sm" fullWidth={compact} onClick={() => setAction({ type: "confirm", id })}>Confirm</Button>
      <Button variant="ghost" size="sm" fullWidth={compact} onClick={() => setAction({ type: "in", id })}>Check in</Button>
      <Button variant="ghost" size="sm" fullWidth={compact} onClick={() => setAction({ type: "out", id })}>Check out</Button>
      <Button variant="ghost" size="sm" fullWidth={compact} onClick={() => setBlockOpen(true)}>Block dates</Button>
      <Button variant="ghost" size="sm" fullWidth={compact} className="text-error" onClick={() => setAction({ type: "cancel", id })}>Cancel</Button>
    </div>
  );

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl">Bookings</h1>
      <p className="mt-1 text-sm text-muted">{bookings.length} total bookings</p>

      <div className="mt-8 hidden rounded-xl border border-border bg-surface lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Property</th>
              <th className="px-4 py-3 font-medium">Guest</th>
              <th className="px-4 py-3 font-medium">Dates</th>
              <th className="px-4 py-3 font-medium">Guests</th>
              <th className="px-4 py-3 font-medium">Amount</th>
              <th className="px-4 py-3 font-medium">Method</th>
              <th className="px-4 py-3 font-medium">Payment</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id} className="border-b border-border last:border-0 align-top">
                <td className="px-4 py-3 font-medium">#{b.id}</td>
                <td className="px-4 py-3">{b.property.name}</td>
                <td className="px-4 py-3">{b.guestName}</td>
                <td className="px-4 py-3 whitespace-nowrap">{b.checkIn} – {b.checkOut}</td>
                <td className="px-4 py-3">{b.guests}</td>
                <td className="px-4 py-3">{formatCurrency(b.amount)}</td>
                <td className="px-4 py-3 capitalize">{b.paymentMethod}</td>
                <td className="px-4 py-3"><PaymentStatusBadge status={b.paymentStatus} /></td>
                <td className="px-4 py-3">
                  <BookingStatusBadge status={b.bookingStatus} />
                  <Actions id={b.id} pending={b.paymentStatus === "pending"} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 space-y-4 lg:hidden">
        {bookings.map((b) => (
          <div key={b.id} className="rounded-xl border border-border bg-surface p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">#{b.id}</p>
              <BookingStatusBadge status={b.bookingStatus} />
            </div>
            <p className="mt-2 text-sm">{b.property.name}</p>
            <p className="text-sm text-muted">{b.guestName} · {b.guests} guests · {b.paymentMethod}</p>
            <p className="text-sm text-muted">{b.checkIn} – {b.checkOut}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-medium">{formatCurrency(b.amount)}</span>
              <PaymentStatusBadge status={b.paymentStatus} />
            </div>
            <Actions id={b.id} pending={b.paymentStatus === "pending"} compact />
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={action?.type === "pay" || action?.type === "confirm"}
        onClose={() => setAction(null)}
        title={action?.type === "pay" ? "Mark direct payment received?" : "Confirm booking?"}
        description={`This confirms booking #${action?.id} and holds the dates.`}
        onConfirm={async () => {
          if (!action) return;
          const result = await confirmDirectPaymentAction(action.id);
          if (result.ok) {
            showToast("Booking confirmed", "success");
            setAction(null);
            router.refresh();
          } else {
            showToast(result.error, "error");
          }
        }}
      />
      <ConfirmDialog
        open={action?.type === "in"}
        onClose={() => setAction(null)}
        title="Check guest in?"
        description={`Mark booking #${action?.id} as checked in.`}
        onConfirm={async () => {
          if (!action) return;
          const result = await adminUpdateBookingStatusAction({
            bookingReference: action.id,
            status: "CHECKED_IN",
          });
          if (result.ok) {
            showToast("Guest checked in", "success");
            setAction(null);
            router.refresh();
          } else {
            showToast(result.error, "error");
          }
        }}
      />
      <ConfirmDialog
        open={action?.type === "out"}
        onClose={() => setAction(null)}
        title="Check guest out?"
        description={`Mark booking #${action?.id} as checked out.`}
        onConfirm={async () => {
          if (!action) return;
          const result = await adminUpdateBookingStatusAction({
            bookingReference: action.id,
            status: "COMPLETED",
          });
          if (result.ok) {
            showToast("Guest checked out", "success");
            setAction(null);
            router.refresh();
          } else {
            showToast(result.error, "error");
          }
        }}
      />
      <ConfirmDialog
        open={action?.type === "cancel"}
        onClose={() => setAction(null)}
        danger
        title="Cancel booking?"
        description={`Cancel booking #${action?.id}.`}
        confirmLabel="Cancel booking"
        onConfirm={async () => {
          if (!action) return;
          const result = await adminUpdateBookingStatusAction({
            bookingReference: action.id,
            status: "CANCELLED",
          });
          if (result.ok) {
            showToast("Booking cancelled", "info");
            setAction(null);
            router.refresh();
          } else {
            showToast(result.error, "error");
          }
        }}
      />

      <Modal open={blockOpen} onClose={() => setBlockOpen(false)} title="Block dates">
        <form
          className="space-y-4"
          action={async (formData) => {
            const result = await blockDatesAction(formData);
            if (result.ok) {
              showToast("Dates blocked", "success");
              setBlockOpen(false);
              router.refresh();
            } else {
              showToast(result.error, "error");
            }
          }}
        >
          <select name="propertyId" className="search-input" required>
            {properties.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Start" name="start" type="date" required />
            <Input label="End" name="end" type="date" required />
          </div>
          <Button type="submit" fullWidth>Block</Button>
        </form>
      </Modal>
    </div>
  );
}
