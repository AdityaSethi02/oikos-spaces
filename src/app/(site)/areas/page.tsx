import Link from "next/link";
import { PropertyImage } from "@/components/media/property-image";
import { ButtonLink } from "@/components/ui/button";
import { areas, getListingCountForArea } from "@/data/mock/areas";
import { brand } from "@/lib/brand";
import { Icons } from "@/components/icons";

export const metadata = { title: "Areas" };

export default function AreasPage() {
  return (
    <div className="section-padding">
      <div className="container-page">
        <h1 className="font-serif text-3xl sm:text-4xl">Explore Udaipur, area by area</h1>
        <p className="mt-3 max-w-2xl text-muted">
          From the lake belt to emerging gated corridors — find the neighbourhood that fits how
          you live, invest or lease. {brand.name} covers the pockets buyers ask for most.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => {
            const count = getListingCountForArea(area.name);
            return (
              <Link
                key={area.slug}
                href={`/areas/${area.slug}`}
                className="group block overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-soft"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <PropertyImage
                    src={area.image}
                    alt={area.name}
                    className="rounded-none transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-serif text-xl text-foreground">{area.name}</h2>
                    <Icons.ArrowRight
                      className="mt-1 h-4 w-4 shrink-0 text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                      aria-hidden
                    />
                  </div>
                  <p className="mt-2 text-sm text-muted">{area.tagline}</p>
                  <p className="mt-3 text-xs text-muted">
                    {count} {count === 1 ? "listing" : "listings"}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-14 text-center">
          <ButtonLink href="/properties" variant="outline">
            Browse all properties
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
