import Link from "next/link";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { BookingStatusBadge } from "@/components/ui/badge";
import { AdminGuestDetailSkeleton } from "@/components/feedback/data-skeletons";
import { getAdminGuestDetail } from "@/server/services/admin-guest.service";
import { isDatabaseConfigured } from "@/lib/env";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminGuestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  if (!isDatabaseConfigured) {
    return <AdminGuestDetailSkeleton />;
  }

  const { id } = await params;
  const guest = await getAdminGuestDetail(id);
  if (!guest) {
    return (
      <div className="text-center">
        <p className="text-muted">Guest not found</p>
        <Link href="/admin/guests" className="mt-4 inline-block text-accent hover:underline">
          Back to guests
        </Link>
      </div>
    );
  }

  const upcoming = guest.bookings.filter((b) =>
    ["inquiry", "reserved", "payment_pending", "confirmed", "checked_in"].includes(b.bookingStatus),
  );
  const past = guest.bookings.filter((b) =>
    ["checked_out", "cancelled", "expired"].includes(b.bookingStatus),
  );

  return (
    <div>
      <Link href="/admin/guests" className="text-sm text-muted hover:text-foreground">← Guests</Link>
      <h1 className="mt-4 font-serif text-2xl sm:text-3xl">{guest.name}</h1>
      <p className="mt-1 text-sm text-muted">{guest.email}{guest.phone ? ` · ${guest.phone}` : ""}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-serif text-lg">Upcoming / active</h2>
          {upcoming.length === 0 ? (
            <p className="mt-3 text-sm text-muted">None</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {upcoming.map((b) => (
                <li key={b.id} className="text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{b.property.name}</span>
                    <BookingStatusBadge status={b.bookingStatus} />
                  </div>
                  <p className="text-muted">{b.checkIn} – {b.checkOut} · {formatCurrency(b.amount)}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="font-serif text-lg">Past</h2>
          {past.length === 0 ? (
            <p className="mt-3 text-sm text-muted">None</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {past.map((b) => (
                <li key={b.id} className="text-sm">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{b.property.name}</span>
                    <BookingStatusBadge status={b.bookingStatus} />
                  </div>
                  <p className="text-muted">{b.checkIn} – {b.checkOut}</p>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="font-serif text-lg">Conversations</h2>
          {guest.conversations.length === 0 ? (
            <p className="mt-3 text-sm text-muted">None</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {guest.conversations.map((c) => (
                <li key={c.id}>
                  <Link href={`/admin/messages?c=${c.id}`} className="text-sm hover:text-accent">
                    {c.propertyName} — {c.lastMessage.slice(0, 60)}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="font-serif text-lg">Documents</h2>
          {guest.documents.length === 0 ? (
            <p className="mt-3 text-sm text-muted">None</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {guest.documents.map((d) => (
                <li key={d.id}>
                  {d.fileName} · {d.bookingReference} · {d.status}
                </li>
              ))}
            </ul>
          )}
          <ButtonLink href="/admin/documents" variant="outline" size="sm" className="mt-4">
            View all documents
          </ButtonLink>
        </Card>
      </div>
    </div>
  );
}
