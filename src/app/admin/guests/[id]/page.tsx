import Link from "next/link";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { FileAttachment } from "@/components/chat/file-attachment";
import { getGuestById, documents } from "@/data/mock/admin";
import { getBookingsWithProperty } from "@/data/mock/bookings";
import { conversations } from "@/data/mock/conversations";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const { guests } = await import("@/data/mock/admin");
  return guests.map((guest) => ({ id: guest.id }));
}

export default async function AdminGuestDetailPage({ params }: Props) {
  const { id } = await params;
  const guest = getGuestById(id);
  if (!guest) notFound();

  const bookings = getBookingsWithProperty().filter((b) => b.guestEmail === guest.email);
  const convos = conversations.filter((c) => c.guestEmail === guest.email);
  const docs = documents.filter((d) => d.guestName === guest.name);
  const upcoming = bookings.filter(
    (b) => b.bookingStatus === "confirmed" || b.bookingStatus === "payment_pending" || b.bookingStatus === "checked_in",
  );
  const past = bookings.filter((b) => b.bookingStatus === "checked_out" || b.bookingStatus === "cancelled");

  return (
    <div>
      <Link href="/admin/guests" className="text-sm text-muted hover:text-foreground">← Guests</Link>
      <h1 className="mt-4 font-serif text-2xl sm:text-3xl">{guest.name}</h1>
      <p className="mt-1 text-sm text-muted">{guest.email} · {guest.phone}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="font-serif text-lg">Upcoming</h2>
          <div className="mt-4 space-y-2 text-sm">
            {upcoming.length === 0 && <p className="text-muted">No upcoming stays</p>}
            {upcoming.map((b) => (
              <p key={b.id}>#{b.id} · {b.property.name} · {b.checkIn} – {b.checkOut}</p>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-serif text-lg">Past bookings</h2>
          <div className="mt-4 space-y-2 text-sm">
            {past.length === 0 && <p className="text-muted">No past stays</p>}
            {past.map((b) => (
              <p key={b.id}>#{b.id} · {b.property.name} · {b.bookingStatus.replace("_", " ")}</p>
            ))}
          </div>
        </Card>
        <Card>
          <h2 className="font-serif text-lg">Conversations</h2>
          <div className="mt-4 space-y-2">
            {convos.map((c) => (
              <Link key={c.id} href="/admin/messages" className="block text-sm hover:text-accent">
                {c.propertyName} · {c.lastMessage}
              </Link>
            ))}
            {convos.length === 0 && <p className="text-sm text-muted">No conversations</p>}
          </div>
        </Card>
        <Card>
          <h2 className="font-serif text-lg">Documents</h2>
          <p className="mt-2 text-xs text-muted">Visible only to the host for this booking. Do not share outside the stay.</p>
          <div className="mt-4 space-y-3">
            {docs.map((d) => (
              <FileAttachment key={d.id} fileName={d.fileName} fileType={d.documentType} status="uploaded" />
            ))}
            {docs.length === 0 && <p className="text-sm text-muted">No documents on file</p>}
          </div>
        </Card>
        <Card>
          <h2 className="font-serif text-lg">Check-in / check-out history</h2>
          <ul className="mt-4 space-y-2 text-sm text-muted">
            {bookings.map((b) => (
              <li key={b.id}>
                #{b.id}: {b.checkIn} in · {b.checkOut} out · {b.bookingStatus.replace("_", " ")}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <ButtonLink href="/admin/messages" className="mt-6">
        Open messages
      </ButtonLink>
    </div>
  );
}
