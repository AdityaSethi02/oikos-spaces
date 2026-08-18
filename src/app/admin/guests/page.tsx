import { Card } from "@/components/ui/card";
import { ButtonLink } from "@/components/ui/button";
import { guests } from "@/data/mock/admin";
import { getBookingsWithProperty } from "@/data/mock/bookings";

export const metadata = { title: "Guests" };

export default function AdminGuestsPage() {
  const bookings = getBookingsWithProperty();

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl">Guests</h1>
      <p className="mt-1 text-sm text-muted">{guests.length} guests</p>

      <div className="mt-8 space-y-4">
        {guests.map((guest) => {
          const guestBookings = bookings.filter(
            (b) => b.guestEmail === guest.email,
          );
          return (
            <Card key={guest.id}>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="font-serif text-lg">{guest.name}</h2>
                  <p className="mt-1 text-sm text-muted">{guest.email}</p>
                  <p className="text-sm text-muted">{guest.phone}</p>
                  <p className="mt-2 text-sm">
                    {guest.totalBookings} booking{guest.totalBookings !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <ButtonLink href={`/admin/guests/${guest.id}`} variant="outline" size="sm">View profile</ButtonLink>
                  <ButtonLink href="/admin/messages" variant="ghost" size="sm">Messages</ButtonLink>
                </div>
              </div>

              {guestBookings.length > 0 && (
                <div className="mt-4 border-t border-border pt-4">
                  <p className="text-xs font-medium uppercase text-muted">Bookings</p>
                  <div className="mt-2 space-y-2">
                    {guestBookings.map((b) => (
                      <div key={b.id} className="flex justify-between text-sm">
                        <span>#{b.id} · {b.property.name}</span>
                        <span className="text-muted">{b.checkIn} – {b.checkOut}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
