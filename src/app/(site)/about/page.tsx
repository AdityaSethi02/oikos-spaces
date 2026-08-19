import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { ButtonLink } from "@/components/ui/button";
import { brand } from "@/lib/brand";

export const metadata = { title: "About Us" };

export default function AboutPage() {
  return (
    <div>
      <section className="section-padding bg-accent-light/20">
        <div className="container-page max-w-3xl text-center">
          <h1 className="font-serif text-4xl sm:text-5xl">Our story</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            {brand.name} was born from a simple belief: that travel should feel personal,
            warm, and rooted in place. We are not a marketplace — we are a small hospitality
            team hosting a curated collection of homes in Udaipur.
          </p>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <ImagePlaceholder variant="lifestyle" seed={0} label="Our hospitality" />
          <div>
            <h2 className="font-serif text-3xl">Personally hosted</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Every property is owned and managed by us. When you stay with {brand.name},
              you are our guest — not a transaction on a platform. We greet you, guide you,
              and ensure your stay feels effortless from booking to checkout.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding bg-surface">
        <div className="container-page grid items-center gap-12 lg:grid-cols-2">
          <div className="lg:order-2">
            <ImagePlaceholder variant="lifestyle" seed={1} label="Thoughtful design" />
          </div>
          <div className="lg:order-1">
            <h2 className="font-serif text-3xl">Thoughtfully designed</h2>
            <p className="mt-4 leading-relaxed text-muted">
              Each home reflects a distinct character — bohemian warmth, Mediterranean grace,
              or minimal luxury. We collaborate with local artisans, source regional materials,
              and design spaces that honour Udaipur&apos;s heritage while offering modern comfort.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-page text-center">
          <h2 className="font-serif text-3xl">Udaipur, our home</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-relaxed text-muted">
            The City of Lakes has a way of slowing time. We live here, and we share it with
            guests who seek beauty, culture, and genuine connection. Our properties are
            doorways into the rhythm of this remarkable city.
          </p>
          <ButtonLink href="/stays" size="lg" className="mt-8">
            Explore our homes
          </ButtonLink>
        </div>
      </section>
    </div>
  );
}
