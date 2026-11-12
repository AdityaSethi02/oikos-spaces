import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { PropertyCard } from "@/components/property/property-card";
import { SearchWidget } from "@/components/booking/search-widget";
import { ButtonLink } from "@/components/ui/button";
import { getFeaturedProperties } from "@/data/mock/properties";
import { getPublishedTestimonials } from "@/data/mock/reviews";
import { brand, whatsappLink } from "@/lib/brand";
import { StarRating } from "@/components/property/property-meta";
import { Icons } from "@/components/icons";
import type { IconType } from "react-icons";

const trust: { icon: IconType; label: string; value: string }[] = [
  { icon: Icons.Landmark, label: "Years of experience", value: `${brand.stats.years}+` },
  { icon: Icons.User, label: "Happy clients", value: `${brand.stats.clients.toLocaleString("en-IN")}+` },
  { icon: Icons.MapPin, label: "Localities covered", value: `${brand.stats.localities}+` },
  { icon: Icons.House, label: "Active listings", value: `${brand.stats.listings}+` },
];

const services = [
  {
    title: "Buy",
    desc: "Curated homes, villas, plots and commercial spaces — verified and priced with local market sense.",
  },
  {
    title: "Sell",
    desc: "Honest valuation, serious buyer outreach, and paperwork support through to registration.",
  },
  {
    title: "Rent & lease",
    desc: "Find tenants or a place to live — residential and commercial, with clear agreements.",
  },
  {
    title: "Advisory",
    desc: "Locality guidance, investment comparisons, and end-to-end help from site visit to handover.",
  },
];

const whyUs = [
  {
    title: "Local expertise",
    desc: "Deep knowledge of Udaipur’s lake belt, old city, and emerging residential corridors.",
  },
  {
    title: "Verified listings",
    desc: "We check title basics and paperwork before recommending a property — fewer surprises.",
  },
  {
    title: "One point of contact",
    desc: "From shortlist to negotiation and registration, you work with a dedicated advisor.",
  },
];

export default function HomePage() {
  const featured = getFeaturedProperties().slice(0, 6);
  const testimonials = getPublishedTestimonials().slice(0, 3);

  return (
    <>
      <section className="relative">
        <div className="relative overflow-hidden">
          <ImagePlaceholder
            variant="hero"
            seed={0}
            className="rounded-none min-h-[420px] sm:min-h-[520px]"
            label="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/25 to-transparent pointer-events-none" />
          <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
            <div className="container-page pb-16 pt-24 sm:pb-20">
              <p className="font-serif text-3xl text-white sm:text-4xl lg:text-5xl text-balance">
                {brand.name}
              </p>
              <h1 className="mt-3 max-w-xl text-lg text-white/90 sm:text-xl text-balance">
                Buy, sell, and rent property in Udaipur with a trusted local firm.
              </h1>
              <p className="mt-3 max-w-lg text-sm text-white/75 sm:text-base">
                Verified listings, clear advice, and end-to-end support — from first site visit to registration.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 pointer-events-auto">
                <ButtonLink href="/properties" variant="secondary" size="lg">
                  Browse properties
                </ButtonLink>
                <ButtonLink
                  href={whatsappLink("Hi, I'd like help finding a property in Udaipur.")}
                  variant="outline"
                  size="lg"
                  className="border-white/40 bg-white/10 text-white hover:bg-white/20"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  WhatsApp us
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
        <div className="container-page relative z-10 -mt-8 pb-2">
          <SearchWidget variant="hero" />
        </div>
      </section>

      <section className="border-y border-border bg-surface py-10">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {trust.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="text-center sm:text-left">
                  <Icon className="mx-auto h-6 w-6 text-accent sm:mx-0" aria-hidden />
                  <p className="mt-2 font-serif text-2xl text-foreground">{item.value}</p>
                  <p className="mt-1 text-sm text-muted">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl">Featured properties</h2>
              <p className="mt-2 text-muted">
                Handpicked homes, villas and rentals across Udaipur.
              </p>
            </div>
            <ButtonLink href="/properties" variant="outline">
              View all properties
            </ButtonLink>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-accent-light/30">
        <div className="container-page">
          <h2 className="font-serif text-3xl sm:text-4xl text-center">Our services</h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted">
            Everything you need to buy, sell, rent or lease — without the marketplace noise.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((item) => (
              <div key={item.title}>
                <h3 className="font-serif text-xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink href="/services" variant="outline">
              Explore services
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <h2 className="font-serif text-3xl sm:text-4xl text-center">Why choose us</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {whyUs.map((item) => (
              <div key={item.title} className="text-center md:text-left">
                <h3 className="font-serif text-xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-page">
          <h2 className="font-serif text-3xl sm:text-4xl text-center">Client stories</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-border bg-background p-6"
              >
                <StarRating rating={review.rating} />
                <p className="mt-4 text-sm leading-relaxed text-foreground">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <p className="mt-4 text-sm text-muted">
                  — {review.guestName}
                  <span className="block text-xs mt-0.5">{review.role}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-foreground text-background">
        <div className="container-page text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-background">
            Ready to make your move?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-background/70">
            Tell us what you&apos;re looking for — we&apos;ll shortlist options and arrange site visits.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/contact" variant="secondary" size="lg">
              Request a callback
            </ButtonLink>
            <ButtonLink
              href={whatsappLink()}
              variant="outline"
              size="lg"
              className="border-white/30 bg-transparent text-background hover:bg-white/10"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
