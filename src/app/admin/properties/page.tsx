import Image from "next/image";
import { ButtonLink } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import { AdminPropertyListSkeleton } from "@/components/feedback/data-skeletons";
import { formatCurrency } from "@/lib/utils";
import { listAllPropertiesForAdmin } from "@/server/services/property.service";
import { isDatabaseConfigured } from "@/lib/env";
import { cn } from "@/lib/utils";

export const metadata = { title: "Properties" };

function PropertyThumbnail({ url, name }: { url?: string; name: string }) {
  if (url) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg sm:aspect-square">
        <Image
          src={url}
          alt={name}
          fill
          unoptimized
          className="object-cover"
          sizes="128px"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex aspect-[4/3] w-full items-center justify-center rounded-lg border border-border/60",
        "bg-gradient-to-br from-stone-100 via-stone-50 to-accent-light/30 sm:aspect-square",
      )}
      aria-label={`${name} — no photo`}
    >
      <Icons.Image className="h-6 w-6 text-muted opacity-60" aria-hidden />
    </div>
  );
}

export default async function AdminPropertiesPage() {
  if (!isDatabaseConfigured) {
    return <AdminPropertyListSkeleton />;
  }

  const properties = await listAllPropertiesForAdmin();

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl">Properties</h1>
          <p className="mt-1 text-sm text-muted">{properties.length} properties</p>
        </div>
        <ButtonLink href="/admin/properties/new">Add property</ButtonLink>
      </div>

      <div className="mt-8 space-y-4">
        {properties.length === 0 && (
          <p className="rounded-xl border border-border bg-surface p-6 text-center text-sm text-muted">
            No properties yet. Create your first listing to get started.
          </p>
        )}
        {properties.map((p) => {
          const thumbUrl = p.media?.[0]?.url;
          const isActive = p.status === "ACTIVE";

          return (
            <div
              key={p.id}
              className="flex flex-col gap-4 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center"
            >
              <div className="w-full shrink-0 sm:w-32">
                <PropertyThumbnail url={thumbUrl} name={p.name} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-serif text-lg">{p.name}</h2>
                  <span
                    className={cn(
                      "rounded-md px-2 py-0.5 text-xs",
                      isActive ? "bg-green-50 text-success" : "bg-stone-100 text-muted",
                    )}
                  >
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-1 text-sm text-muted">{p.location}</p>
                <p className="mt-2 text-sm">
                  {formatCurrency(p.pricePerNight)}/night
                </p>
              </div>
              <ButtonLink href={`/admin/properties/${p.id}`} variant="outline" size="sm">
                Edit
              </ButtonLink>
            </div>
          );
        })}
      </div>
    </div>
  );
}
