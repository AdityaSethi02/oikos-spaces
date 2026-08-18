import { SearchWidget } from "@/components/booking/search-widget";
import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { PropertyCard } from "@/components/property/property-card";
import { ButtonLink } from "@/components/ui/button";
import { properties } from "@/data/mock/properties";
import { getReviewsByPropertyId } from "@/data/mock/reviews";
import { brand } from "@/lib/brand";
import { StarRating } from "@/components/property/property-meta";
import { Icons } from "@/components/icons";
import type { IconType } from "react-icons";

const highlights: { icon: IconType; label: string; desc: string }[] = [
  { icon: Icons.House, label: "Entire Home", desc: "Private spaces, exclusively yours" },
  { icon: Icons.Key, label: "Self Check-in", desc: "Flexible arrival on your schedule" },
  { icon: Icons.Car, label: "Free Parking", desc: "Complimentary parking at all properties" },
  { icon: Icons.Wifi, label: "Fast Wi-Fi", desc: "Reliable connectivity for work and leisure" },
];

const whyStay = [
  {
    title: "Personally hosted",
    desc: "Every stay is managed by us — not a faceless platform. Real people, real care.",
  },
  {
    title: "Thoughtfully designed",
    desc: "Each property is curated with local character, comfort, and attention to detail.",
  },
  {
    title: "Direct booking",
    desc: "Book online or arrange payment directly. No marketplace fees, no middlemen.",
  },
];

export default function HomePage() {
  const featuredReviews = properties.flatMap((p) =>
    getReviewsByPropertyId(p.id).slice(0, 1).map((r) => ({ ...r, propertyName: p.name })),
  );

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <div className="relative overflow-hidden">
          <ImagePlaceholder variant="hero" className="rounded-none min-h-[420px] sm:min-h-[520px]" label="Hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 flex flex-col justify-end pointer-events-none">
            <div className="container-page pb-12 pt-24 sm:pb-16">
              <h1 className="max-w-2xl font-serif text-3xl text-white sm:text-4xl lg:text-5xl text-balance">
                Boutique stays that feel like home.
              </h1>
              <p className="mt-4 max-w-lg text-base text-white/85 sm:text-lg">
                Thoughtfully designed spaces in Udaipur, hosted with care.
              </p>
            </div>
          </div>
        </div>
        <div className="container-page relative z-10 -mt-16 sm:-mt-20">
          <SearchWidget variant="hero" />
        </div>
      </section>

      {/* Our Homes */}
      <section className="section-padding">
        <div className="container-page">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <h2 className="font-serif text-3xl sm:text-4xl">Our Homes</h2>
              <p className="mt-2 text-muted">
                Three distinctive stays, each with its own character.
              </p>
            </div>
            <ButtonLink href="/stays" variant="outline">View all stays</ButtonLink>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="border-y border-border bg-surface py-10">
        <div className="container-page">
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4">
            {highlights.map((h) => {
              const Icon = h.icon;
              return (
              <div key={h.label} className="text-center sm:text-left">
                <Icon className="mx-auto h-6 w-6 text-accent sm:mx-0" aria-hidden />
                <p className="mt-2 font-medium text-foreground">{h.label}</p>
                <p className="mt-1 text-sm text-muted">{h.desc}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why stay with us */}
      <section className="section-padding">
        <div className="container-page">
          <h2 className="font-serif text-3xl sm:text-4xl text-center">Why stay with us</h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {whyStay.map((item) => (
              <div key={item.title} className="text-center md:text-left">
                <h3 className="font-serif text-xl">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Udaipur */}
      <section className="section-padding bg-accent-light/30">
        <div className="container-page grid items-center gap-10 lg:grid-cols-2">
          <ImagePlaceholder variant="lifestyle" label="Udaipur" />
          <div>
            <h2 className="font-serif text-3xl sm:text-4xl">
              Discover {brand.location.split(",")[0]}
            </h2>
            <p className="mt-4 text-muted leading-relaxed">
              From sunrise boat rides on Lake Pichola to hidden lanes of the old city,
              Udaipur offers a rhythm of beauty and warmth. Our properties place you
              at the heart of it all — with the comfort of a home waiting at day&apos;s end.
            </p>
            <ButtonLink href="/experiences" variant="outline" className="mt-6">
              Explore experiences
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="section-padding">
        <div className="container-page">
          <h2 className="font-serif text-3xl sm:text-4xl text-center">Guest reviews</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featuredReviews.map((review) => (
              <div
                key={review.id}
                className="rounded-xl border border-border bg-surface p-6"
              >
                <StarRating rating={review.rating} />
                <p className="mt-4 text-sm leading-relaxed text-foreground">
                  &ldquo;{review.comment}&rdquo;
                </p>
                <p className="mt-4 text-sm text-muted">
                  — {review.guestName}, {review.propertyName}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-foreground text-background">
        <div className="container-page text-center">
          <h2 className="font-serif text-3xl sm:text-4xl text-background">
            Ready for your Udaipur escape?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-background/70">
            Browse our homes, check availability, and book directly — online or with a personal touch.
          </p>
          <ButtonLink href="/stays" variant="secondary" size="lg" className="mt-8">
              Explore stays
            </ButtonLink>
        </div>
      </section>
    </>
  );
}
