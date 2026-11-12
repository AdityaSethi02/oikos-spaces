import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyImage } from "@/components/media/property-image";
import { PropertyCard } from "@/components/property/property-card";
import { ButtonLink } from "@/components/ui/button";
import { Icons } from "@/components/icons";
import {
  areas,
  getAreaBySlug,
  getPropertiesForArea,
} from "@/data/mock/areas";
import { brand, whatsappLink } from "@/lib/brand";

export function generateStaticParams() {
  return areas.map((area) => ({ slug: area.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  return { title: area ? `${area.name} | Areas` : "Area" };
}

export default async function AreaDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const area = getAreaBySlug(slug);
  if (!area) notFound();

  const listings = getPropertiesForArea(area.name);

  return (
    <div>
      <section className="relative min-h-[42vh] overflow-hidden sm:min-h-[48vh]">
        <PropertyImage
          src={area.image}
          alt={area.name}
          className="absolute inset-0 rounded-none min-h-[42vh] sm:min-h-[48vh]"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/15" />
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container-page pb-12 pt-24">
            <Link
              href="/areas"
              className="inline-flex items-center gap-1 text-sm text-white/80 hover:text-white"
            >
              <Icons.ArrowLeft className="h-4 w-4" aria-hidden />
              All areas
            </Link>
            <h1 className="mt-4 font-serif text-4xl text-white sm:text-5xl">{area.name}</h1>
            <p className="mt-3 max-w-xl text-white/85">{area.tagline}</p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div>
            <h2 className="font-serif text-2xl">About this neighbourhood</h2>
            <p className="mt-4 leading-relaxed text-muted">{area.description}</p>
            <ul className="mt-6 space-y-2">
              {area.highlights.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-foreground">
                  <Icons.Check className="h-4 w-4 text-accent" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-border bg-surface p-6">
            <h3 className="font-serif text-xl">Looking here?</h3>
            <p className="mt-2 text-sm text-muted">
              Tell {brand.name} your budget and timeline — we&apos;ll shortlist options in{" "}
              {area.name}.
            </p>
            <div className="mt-6 flex flex-col gap-2">
              <ButtonLink href={`/properties?locality=${encodeURIComponent(area.name)}`}>
                View listings
              </ButtonLink>
              <ButtonLink href="/contact" variant="outline">
                Book consultation
              </ButtonLink>
              <ButtonLink
                href={whatsappLink(`Hi, I'm interested in properties in ${area.name}.`)}
                variant="outline"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-page">
          <h2 className="font-serif text-3xl">Listings in {area.name}</h2>
          {listings.length === 0 ? (
            <p className="mt-4 text-muted">
              No live listings in this pocket right now — ask us for off-market options.
            </p>
          ) : (
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
