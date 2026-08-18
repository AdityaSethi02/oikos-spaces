import Link from "next/link";
import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { Button } from "@/components/ui/button";
import { properties } from "@/data/mock/properties";
import { getUpcomingBookings } from "@/data/mock/bookings";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Properties" };

export default function AdminPropertiesPage() {
  const upcoming = getUpcomingBookings();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl">Properties</h1>
          <p className="mt-1 text-sm text-muted">{properties.length} properties</p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {properties.map((p, i) => {
          const next = upcoming.find((b) => b.propertyId === p.id);
          const occupancy = [72, 54, 81][i] ?? 60;
          return (
            <div
              key={p.id}
              className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center"
            >
              <div className="w-full shrink-0 overflow-hidden rounded-lg sm:w-32">
                <ImagePlaceholder variant="property" className="rounded-lg min-h-[100px]" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-lg">{p.name}</h2>
                  <span className="rounded-md bg-green-50 px-2 py-0.5 text-xs text-success">Active</span>
                </div>
                <p className="mt-1 text-sm text-muted">{p.location}</p>
                <p className="mt-2 text-sm">
                  {formatCurrency(p.pricePerNight)}/night · Occupancy {occupancy}% (demo)
                </p>
                <p className="mt-1 text-sm text-muted">
                  Upcoming: {next ? `${next.guestName} · ${next.checkIn}` : "None"}
                </p>
              </div>
              <Link href={`/admin/properties/${p.id}`}>
                <Button variant="outline" size="sm">Edit</Button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
