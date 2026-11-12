import { PropertyImage } from "@/components/media/property-image";
import { ButtonLink } from "@/components/ui/button";
import { brand, whatsappLink } from "@/lib/brand";
import { brandImages } from "@/lib/media";

export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div>
      <section className="section-padding bg-accent-light/20">
        <div className="container-page max-w-3xl text-center">
          <h1 className="font-serif text-4xl sm:text-5xl">About {brand.name}</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            We are a Udaipur real-estate firm helping families, investors and tenants buy,
            sell, rent and lease with clarity — not marketplace noise.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="aspect-[4/3] overflow-hidden rounded-xl">
            <PropertyImage
              src={brandImages.about}
              alt={`${brand.founder.name} — ${brand.name}`}
              className="rounded-xl"
              priority
            />
          </div>
          <div>
            <p className="text-sm font-medium uppercase tracking-wider text-accent">
              Meet the founder
            </p>
            <h2 className="mt-2 font-serif text-3xl">{brand.founder.name}</h2>
            <p className="mt-1 text-muted">{brand.founder.title}</p>
            <p className="mt-4 leading-relaxed text-muted">
              With {brand.founder.experienceYears}+ years in Udaipur&apos;s property market and{" "}
              {brand.founder.clientsServed.toLocaleString("en-IN")}+ clients served,{" "}
              {brand.founder.name.split(" ")[0]} built {brand.name} on trust, transparent
              pricing advice, and end-to-end support from first site visit to registration.
            </p>
            <p className="mt-4 leading-relaxed text-muted">
              Whether you need a lake-belt apartment, a heritage haveli, a plot to build on,
              or a commercial space on Airport Road — we shortlist carefully and negotiate
              with your interests first.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="order-2 lg:order-1">
            <h2 className="font-serif text-2xl">Rooted in Udaipur</h2>
            <p className="mt-4 leading-relaxed text-muted">
              From the lake belt to emerging residential corridors, we know the streets,
              the paperwork, and the prices — so you don&apos;t have to learn the market alone.
            </p>
          </div>
          <div className="order-1 aspect-[16/10] overflow-hidden rounded-xl lg:order-2">
            <PropertyImage
              src={brandImages.city}
              alt="Udaipur cityscape"
              className="rounded-xl"
            />
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-page grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl">Our vision</h2>
            <p className="mt-4 leading-relaxed text-muted">
              To be Udaipur&apos;s most trusted real-estate partner — the first name people
              think of when buying, selling or renting property.
            </p>
          </div>
          <div>
            <h2 className="font-serif text-2xl">Our mission</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Make every property journey simple, safe and rewarding through local knowledge,
              verified listings and honest advice.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page text-center">
          <h2 className="font-serif text-3xl">Looking for a property partner?</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted">
            Tell us your budget, locality and timeline — we&apos;ll come back with a shortlist.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/properties" size="lg">
              Browse properties
            </ButtonLink>
            <ButtonLink
              href={whatsappLink()}
              variant="outline"
              size="lg"
              target="_blank"
              rel="noopener noreferrer"
            >
              WhatsApp us
            </ButtonLink>
          </div>
        </div>
      </section>
    </div>
  );
}
