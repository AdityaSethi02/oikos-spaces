import Link from "next/link";
import { DataCard } from "@/components/admin/admin-sidebar";
import { AdminDashboardSkeleton } from "@/components/feedback/data-skeletons";
import { BookingStatusBadge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { getAdminDashboardStats, getUpcomingAdminBookings } from "@/server/services/admin-dashboard.service";
import { isDatabaseConfigured } from "@/lib/env";

export const metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!isDatabaseConfigured) {
    return <AdminDashboardSkeleton />;
  }

  const [stats, upcoming] = await Promise.all([
    getAdminDashboardStats(),
    getUpcomingAdminBookings(5),
  ]);

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">Welcome back. Here&apos;s what&apos;s happening today.</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DataCard label="Today's check-ins" value={stats.todayCheckIns} />
        <DataCard label="Today's check-outs" value={stats.todayCheckOuts} />
        <DataCard label="Upcoming bookings" value={stats.upcomingBookings} />
        <DataCard label="Occupancy" value={`${stats.occupancy}%`} />
        <DataCard label="Total revenue" value={formatCurrency(stats.totalRevenue)} />
        <DataCard label="Pending inquiries" value={stats.pendingInquiries} />
        <DataCard label="Pending documents" value={stats.pendingDocuments} />
        <DataCard label="Pending direct payments" value={stats.pendingDirectPayments} />
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl">Upcoming bookings</h2>
          <Link href="/admin/bookings" className="text-sm text-accent hover:underline">
            View all
          </Link>
        </div>

        {upcoming.length === 0 ? (
          <p className="mt-4 text-sm text-muted">No upcoming bookings.</p>
        ) : (
          <>
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
                      <td className="px-4 py-3">#{b.id}</td>
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
          </>
        )}
      </div>
    </div>
  );
}
