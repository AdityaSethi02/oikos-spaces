import Link from "next/link";
import { PropertyImage } from "@/components/media/property-image";
import { PropertyCard } from "@/components/property/property-card";
import { SearchWidget } from "@/components/booking/search-widget";
import { FaqSection } from "@/components/marketing/faq-section";
import { PartnersStrip } from "@/components/marketing/partners-strip";
import { Reveal } from "@/components/motion/reveal";
import { ButtonLink } from "@/components/ui/button";
import { getFeaturedProperties } from "@/data/mock/properties";
import { getPublishedTestimonials } from "@/data/mock/reviews";
import { faqs } from "@/data/mock/faqs";
import { brand, whatsappLink, whyUs } from "@/lib/brand";
import { brandImages } from "@/lib/media";
import { StarRating } from "@/components/property/property-meta";

const pillars = [
  {
    title: "Buy with clarity",
    desc: "Verified listings, fair pricing advice, and paperwork support through registration.",
  },
  {
    title: "Sell with confidence",
    desc: "Honest valuation and serious buyer outreach — without marketplace noise.",
  },
  {
    title: "Rent & lease simply",
    desc: "Homes and commercial spaces matched carefully for owners and tenants.",
  },
];

export default function HomePage() {
  const featured = getFeaturedProperties().slice(0, 6);
  const testimonials = getPublishedTestimonials().slice(0, 3);

  return (
    <>
      <section className="relative">
        <div className="relative min-h-[72vh] overflow-hidden sm:min-h-[78vh]">
          <PropertyImage
            src={brandImages.hero}
            alt={`${brand.name} — Udaipur homes`}
            className="absolute inset-0 rounded-none min-h-[72vh] sm:min-h-[78vh] animate-fade-in"
            priority
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: [
                "linear-gradient(to top, color-mix(in srgb, var(--hero-overlay) 78%, transparent) 0%, color-mix(in srgb, var(--hero-overlay) 45%, transparent) 45%, color-mix(in srgb, var(--hero-overlay) 22%, transparent) 100%)",
                "linear-gradient(to right, color-mix(in srgb, var(--hero-overlay) 35%, transparent), transparent 55%)",
              ].join(", "),
            }}
          />
          <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
            <div className="container-page pb-20 pt-28 sm:pb-24 animate-fade-up">
              <p className="font-serif text-4xl text-white drop-shadow-sm sm:text-5xl lg:text-6xl text-balance">
                {brand.name}
              </p>
              <h1 className="mt-4 max-w-lg text-base text-white/95 drop-shadow-sm sm:text-lg text-balance">
                Trusted property advisors for buying, selling and renting in Udaipur.
              </h1>
              <div className="mt-8 pointer-events-auto flex flex-wrap gap-3">
                <ButtonLink href="/properties" variant="secondary" size="lg">
                  Browse properties
                </ButtonLink>
                <ButtonLink href="/contact" variant="inverse" size="lg">
                  Book consultation
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
        <div className="container-page relative z-10 -mt-10 pb-6 sm:pb-8">
          <SearchWidget variant="hero" />
        </div>
      </section>

      <section className="border-b border-border bg-surface py-8">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {[
              { value: `${brand.stats.years}+`, label: "Years advising" },
              {
                value: `${brand.stats.clients.toLocaleString("en-IN")}+`,
                label: "Families & investors",
              },
              { value: `${brand.stats.localities}+`, label: "Localities" },
              { value: `${brand.stats.listings}+`, label: "Active listings" },
            ].map((item) => (
              <div key={item.label} className="text-center sm:text-left">
                <p className="font-serif text-2xl text-foreground sm:text-3xl">{item.value}</p>
                <p className="mt-1 text-sm text-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <Reveal>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <h2 className="font-serif text-3xl sm:text-4xl">Featured properties</h2>
                <p className="mt-2 text-muted">Homes, villas and rentals across Udaipur.</p>
              </div>
              <ButtonLink href="/properties" variant="outline">
                View all
              </ButtonLink>
            </div>
          </Reveal>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((property, i) => (
              <Reveal key={property.id} delayMs={i * 40}>
                <PropertyCard property={property} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="container-page">
          <Reveal>
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="font-serif text-3xl sm:text-4xl text-secondary-foreground">
              How we help
            </h2>
            <p className="mt-3 text-secondary-foreground/70">
              Local knowledge, verified listings, and one advisor with you from shortlist to handover.
            </p>
          </div>
          </Reveal>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {pillars.map((item) => (
              <div key={item.title} className="border-t border-secondary-foreground/20 pt-6">
                <h3 className="font-serif text-xl text-secondary-foreground">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-secondary-foreground/70">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 text-center">
            <ButtonLink
              href="/services"
              variant="outline"
              className="border-secondary-foreground/30 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10"
            >
              See all services
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page">
          <Reveal>
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl sm:text-4xl">Why clients choose us</h2>
              <p className="mt-3 text-muted">
                RERA-aware shortlists, NRI-ready process, and support that continues past the
                handshake.
              </p>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-8 sm:grid-cols-2">
            {whyUs.map((item) => (
              <div key={item.title} className="border-t border-border pt-6">
                <h3 className="font-serif text-xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PartnersStrip />

      <section className="section-padding">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <div className="aspect-[4/3] overflow-hidden rounded-xl">
            <PropertyImage
              src={brandImages.about}
              alt={brand.founder.name}
              className="rounded-xl"
            />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-accent">
              Meet the founder
            </p>
            <h2 className="mt-2 font-serif text-3xl">{brand.founder.name}</h2>
            <p className="mt-1 text-muted">{brand.founder.title}</p>
            <p className="mt-4 leading-relaxed text-muted">
              {brand.founder.experienceYears}+ years in Udaipur&apos;s market and{" "}
              {brand.founder.clientsServed.toLocaleString("en-IN")}+ clients served — with
              transparent advice and end-to-end support.
            </p>
            <ButtonLink href="/about" variant="outline" className="mt-6">
              Our story
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="section-padding bg-secondary text-secondary-foreground">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <h2 className="font-serif text-3xl sm:text-4xl text-secondary-foreground">
              Client stories
            </h2>
            <Link
              href="/testimonials"
              className="text-sm font-medium text-highlight hover:underline"
            >
              Read all testimonials
            </Link>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {testimonials.map((review) => (
              <div key={review.id} className="border-t border-secondary-foreground/20 pt-6">
                <StarRating rating={review.rating} />
                <p className="mt-4 text-sm leading-relaxed text-secondary-foreground">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <p className="mt-4 text-sm font-medium text-secondary-foreground">
                  {review.guestName}
                </p>
                <p className="text-xs text-secondary-foreground/65">{review.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FaqSection items={faqs} />

      <section className="section-padding bg-hero-overlay text-background">
        <div className="container-page text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-background">
            Ready to talk property?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-background/70">
            Share your budget and locality — we&apos;ll shortlist options and arrange visits.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/contact" variant="secondary" size="lg">
              Book consultation
            </ButtonLink>
            <ButtonLink
              href={whatsappLink("Hi, I'd like help finding a property in Udaipur.")}
              variant="inverse"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp an advisor
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
