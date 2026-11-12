import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { ButtonLink } from "@/components/ui/button";
import { StatusBadge } from "@/components/property/property-meta";
import { properties } from "@/data/mock/properties";

export const metadata = { title: "Properties" };

export default function AdminPropertiesPage() {
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl">Properties</h1>
          <p className="mt-1 text-sm text-muted">{properties.length} listings</p>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {properties.map((p) => (
          <div
            key={p.id}
            className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center"
          >
            <div className="w-full shrink-0 overflow-hidden rounded-lg sm:w-32">
              <ImagePlaceholder
                variant="property"
                seed={p.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0)}
                className="rounded-lg aspect-[4/3] sm:aspect-square"
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-serif text-lg">{p.name}</h2>
                <StatusBadge status={p.status} />
              </div>
              <p className="mt-1 text-sm text-muted">
                {p.location} · {p.type}
              </p>
              <p className="mt-2 text-sm font-medium">{p.priceLabel}</p>
              {p.bedrooms > 0 && (
                <p className="mt-1 text-sm text-muted">
                  {p.bedrooms} BHK · {p.areaSqFt.toLocaleString("en-IN")} sq.ft
                </p>
              )}
            </div>
            <ButtonLink href={`/admin/properties/${p.id}`} variant="outline" size="sm">
              Edit
            </ButtonLink>
          </div>
        ))}
      </div>
    </div>
  );
}
