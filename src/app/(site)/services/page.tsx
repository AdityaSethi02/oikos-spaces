import { FaqSection } from "@/components/marketing/faq-section";
import { ButtonLink } from "@/components/ui/button";
import { faqs } from "@/data/mock/faqs";
import { brand, whatsappLink } from "@/lib/brand";

export const metadata = { title: "Services" };

const services = [
  {
    title: "Property buying",
    desc: "End-to-end help buying homes, villas, plots and commercial spaces — right price, clean paperwork, faster closing.",
  },
  {
    title: "Property selling",
    desc: "Market valuation, listing, buyer screening and negotiation support until registration is done.",
  },
  {
    title: "Rentals & leasing",
    desc: "Match owners with reliable tenants, and help renters find the right home or office with clear agreements.",
  },
  {
    title: "Commercial advisory",
    desc: "Showrooms, offices and investment assets across Udaipur’s high-visibility corridors.",
  },
  {
    title: "Plots & land",
    desc: "Residential plots with clear title guidance and practical advice on build readiness.",
  },
  {
    title: "NRI investment advisory",
    desc: "Remote-first buying for clients abroad — video walkthroughs, power of attorney coordination, and compliant documentation handoffs.",
  },
  {
    title: "Legal & RERA compliance",
    desc: "Title clarity checks, RERA registration review where applicable, and coordination through registry — so surprises show up early, not at signing.",
  },
  {
    title: "Home loans & mortgages",
    desc: "Introductions to bank and NBFC options that fit your profile — competitive rates, faster sanction support, and NRI loan pathways.",
  },
  {
    title: "Interior consultation",
    desc: "Curated designer and contractor introductions when you want a move-in-ready plan without running the fit-out alone.",
  },
  {
    title: "Investment & resale strategy",
    desc: "Locality comparisons, rental potential, hold-vs-sell timing, and appreciation context for serious buyers and owners.",
  },
];

export default function ServicesPage() {
  return (
    <div>
      <div className="section-padding">
        <div className="container-page">
          <h1 className="font-serif text-3xl sm:text-4xl">Services</h1>
          <p className="mt-3 max-w-2xl text-muted">
            {brand.name} covers your property journey in Udaipur — buy, sell, rent, lease, NRI
            support, loans and documentation — with one dedicated point of contact.
          </p>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <div key={s.title} className="border-t border-border pt-6">
                <h2 className="font-serif text-xl">{s.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-muted">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-xl bg-foreground px-6 py-10 text-center text-background sm:px-10">
            <h2 className="font-serif text-2xl sm:text-3xl text-background">
              Not sure where to start?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-background/70">
              Share your requirements and we&apos;ll recommend the right next step.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <ButtonLink href="/contact" variant="secondary">
                Book a consultation
              </ButtonLink>
              <ButtonLink
                href={whatsappLink()}
                variant="inverse"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </ButtonLink>
            </div>
          </div>
        </div>
      </div>

      <FaqSection items={faqs} className="bg-surface" />
    </div>
  );
}
