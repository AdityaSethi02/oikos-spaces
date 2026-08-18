import Link from "next/link";
import { DataCard } from "@/components/admin/admin-sidebar";
import { BookingStatusBadge } from "@/components/ui/badge";
import { adminStats } from "@/data/mock/admin";
import { getUpcomingBookings } from "@/data/mock/bookings";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default function AdminDashboardPage() {
  const upcoming = getUpcomingBookings().slice(0, 5);

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Welcome back. Here&apos;s what&apos;s happening today.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DataCard label="Today's check-ins" value={adminStats.todayCheckIns} />
        <DataCard label="Today's check-outs" value={adminStats.todayCheckOuts} />
        <DataCard label="Upcoming bookings" value={adminStats.upcomingBookings} />
        <DataCard label="Occupancy" value={`${adminStats.occupancy}%`} />
        <DataCard label="Total revenue" value={formatCurrency(adminStats.totalRevenue)} subtext="Demo YTD" />
        <DataCard label="Pending inquiries" value={adminStats.pendingInquiries} />
        <DataCard label="Pending ID requests" value={adminStats.pendingIdRequests} />
        <DataCard label="Pending direct payments" value={adminStats.pendingDirectPayments} />
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl">Upcoming bookings</h2>
          <Link href="/admin/bookings" className="text-sm text-accent hover:underline">
            View all
          </Link>
        </div>

        {/* Desktop table */}
        <div className="mt-4 hidden overflow-x-auto rounded-xl border border-border bg-surface md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-4 py-3 font-medium">Booking ID</th>
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Guest</th>
                <th className="px-4 py-3 font-medium">Dates</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {upcoming.map((b) => (
                <tr key={b.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/bookings`} className="hover:text-accent">
                      #{b.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{b.property.name}</td>
                  <td className="px-4 py-3">{b.guestName}</td>
                  <td className="px-4 py-3">{b.checkIn} – {b.checkOut}</td>
                  <td className="px-4 py-3">{formatCurrency(b.amount)}</td>
                  <td className="px-4 py-3">
                    <BookingStatusBadge status={b.bookingStatus} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="mt-4 space-y-3 md:hidden">
          {upcoming.map((b) => (
            <div key={b.id} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">#{b.id}</p>
                <BookingStatusBadge status={b.bookingStatus} />
              </div>
              <p className="mt-2 text-sm">{b.property.name}</p>
              <p className="text-sm text-muted">{b.guestName}</p>
              <p className="mt-1 text-sm text-muted">{b.checkIn} – {b.checkOut}</p>
              <p className="mt-2 font-medium">{formatCurrency(b.amount)}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
