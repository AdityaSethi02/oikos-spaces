import { StarRating } from "@/components/property/property-meta";
import { ButtonLink } from "@/components/ui/button";
import { getPublishedTestimonials } from "@/data/mock/reviews";
import { brand, whatsappLink } from "@/lib/brand";

export const metadata = { title: "Testimonials" };

export default function TestimonialsPage() {
  const testimonials = getPublishedTestimonials();

  return (
    <div className="section-padding">
      <div className="container-page">
        <h1 className="font-serif text-3xl sm:text-4xl">Client stories</h1>
        <p className="mt-3 max-w-2xl text-muted">
          What buyers, sellers, tenants and investors say about working with {brand.name} in
          Udaipur.
        </p>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {testimonials.map((review) => (
            <div key={review.id} className="border-t border-border pt-6">
              <StarRating rating={review.rating} />
              <p className="mt-4 text-sm leading-relaxed text-foreground">
                &ldquo;{review.comment}&rdquo;
              </p>
              <p className="mt-4 text-sm font-medium text-foreground">{review.guestName}</p>
              <p className="text-xs text-muted">{review.role}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-xl bg-foreground px-6 py-10 text-center text-background sm:px-10">
          <h2 className="font-serif text-2xl sm:text-3xl text-background">
            Ready for your own story?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-background/70">
            Book a consultation or message us with your budget and locality.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <ButtonLink href="/contact" variant="secondary">
              Book consultation
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
  );
}
