import Link from "next/link";
import { DataCard } from "@/components/admin/admin-sidebar";
import { StatusBadge } from "@/components/property/property-meta";
import { properties } from "@/data/mock/properties";
import { getPublishedTestimonials } from "@/data/mock/reviews";
import { brand } from "@/lib/brand";
import { formatCurrency } from "@/lib/utils";

export const metadata = { title: "Dashboard" };

export default function AdminDashboardPage() {
  const forSale = properties.filter((p) => p.status === "For Sale").length;
  const forRent = properties.filter((p) => p.status === "For Rent" || p.status === "For Lease").length;
  const featured = properties.filter((p) => p.featured).length;
  const testimonials = getPublishedTestimonials().length;
  const inventoryValue = properties
    .filter((p) => p.status === "For Sale")
    .reduce((sum, p) => sum + p.price, 0);

  return (
    <div>
      <h1 className="font-serif text-2xl sm:text-3xl">Dashboard</h1>
      <p className="mt-1 text-sm text-muted">
        {brand.name} listing overview — demo data.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <DataCard label="Total listings" value={properties.length} />
        <DataCard label="For sale" value={forSale} />
        <DataCard label="Rent / lease" value={forRent} />
        <DataCard label="Featured" value={featured} />
        <DataCard
          label="Sale inventory value"
          value={formatCurrency(inventoryValue)}
          subtext="Demo sum of sale listings"
        />
        <DataCard label="Client testimonials" value={testimonials} />
        <DataCard label="Localities" value={brand.stats.localities} />
        <DataCard label="Pending enquiries" value={8} subtext="Demo" />
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-xl">Recent listings</h2>
          <Link href="/admin/properties" className="text-sm text-accent hover:underline">
            View all
          </Link>
        </div>

        <div className="mt-4 hidden overflow-x-auto rounded-xl border border-border bg-surface md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="px-4 py-3 font-medium">Property</th>
                <th className="px-4 py-3 font-medium">Locality</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Price</th>
                <th className="px-4 py-3 font-medium">Type</th>
              </tr>
            </thead>
            <tbody>
              {properties.slice(0, 6).map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/properties/${p.id}`} className="hover:text-accent">
                      {p.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{p.locality}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={p.status} />
                  </td>
                  <td className="px-4 py-3">{p.priceLabel}</td>
                  <td className="px-4 py-3">{p.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 space-y-3 md:hidden">
          {properties.slice(0, 6).map((p) => (
            <div key={p.id} className="rounded-xl border border-border bg-surface p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="font-medium">{p.name}</p>
                <StatusBadge status={p.status} />
              </div>
              <p className="mt-2 text-sm text-muted">
                {p.locality} · {p.type}
              </p>
              <p className="mt-1 text-sm font-medium">{p.priceLabel}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
