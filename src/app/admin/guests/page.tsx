import { listAdminGuests } from "@/server/services/admin-guest.service";
import { AdminTablePageSkeleton } from "@/components/feedback/data-skeletons";
import { isDatabaseConfigured } from "@/lib/env";

export const metadata = { title: "Guests" };

export default async function AdminGuestsPage() {
  if (!isDatabaseConfigured) {
    return <AdminTablePageSkeleton />;
  }

  const guests = await listAdminGuests();

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl">Guests</h1>
      <p className="mt-1 text-sm text-muted">{guests.length} guests</p>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-muted">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Bookings</th>
              <th className="px-4 py-3 font-medium">Conversations</th>
            </tr>
          </thead>
          <tbody>
            {guests.map((guest) => (
              <tr key={guest.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <a href={`/admin/guests/${guest.id}`} className="hover:text-accent">
                    {guest.name}
                  </a>
                </td>
                <td className="px-4 py-3">{guest.email}</td>
                <td className="px-4 py-3">{guest.bookingCount}</td>
                <td className="px-4 py-3">{guest.conversationCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
