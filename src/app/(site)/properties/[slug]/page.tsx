import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyGallery } from "@/components/property/property-gallery";
import { PropertyAmenities } from "@/components/property/property-amenities";
import { EnquiryCard, MobileEnquiryBar } from "@/components/property/enquiry-card";
import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { PropertyActions } from "@/components/property/property-actions";
import { PropertyMeta, StatusBadge } from "@/components/property/property-meta";
import { getPropertyBySlug } from "@/data/mock/properties";
import { getReviewsByPropertyId } from "@/data/mock/reviews";
import { Icons } from "@/components/icons";
import { StarRating } from "@/components/property/property-meta";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const { properties } = await import("@/data/mock/properties");
  return properties.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) return { title: "Property not found" };
  return { title: property.name, description: property.description };
}

export default async function PropertyDetailPage({ params }: Props) {
  const { slug } = await params;
  const property = getPropertyBySlug(slug);
  if (!property) notFound();

  const reviews = getReviewsByPropertyId(property.id);

  return (
    <div className="pb-24 lg:pb-12">
      <div className="container-page py-6">
        <nav className="text-sm text-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-foreground">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/properties" className="hover:text-foreground">
            Properties
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{property.name}</span>
        </nav>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2">
              <StatusBadge status={property.status} />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl">
              {property.name}
            </h1>
            <p className="mt-1 text-muted">{property.location}</p>
            <p className="mt-2 font-serif text-2xl text-foreground sm:hidden">
              {property.priceLabel}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:justify-end">
            <PropertyActions propertyId={property.id} propertyName={property.name} />
          </div>
        </div>
      </div>

      <div className="container-page">
        <PropertyGallery
          galleryCount={property.galleryCount}
          propertyName={property.name}
        />
      </div>

      <div className="container-page mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12">
        <div className="space-y-10">
          <div>
            <p className="text-lg font-medium">
              {property.type} · {property.status}
            </p>
            <PropertyMeta
              className="mt-2"
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              areaSqFt={property.areaSqFt}
            />
            {property.highlights.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {property.highlights.map((h) => (
                  <span
                    key={h}
                    className="rounded-md bg-accent-light px-2.5 py-1 text-xs text-accent"
                  >
                    {h}
                  </span>
                ))}
              </div>
            )}
          </div>

          <hr className="border-border" />

          <section>
            <h2 className="font-serif text-xl">About this property</h2>
            <p className="mt-4 leading-relaxed text-muted">{property.about}</p>
          </section>

          <section>
            <h2 className="font-serif text-xl">Amenities</h2>
            <PropertyAmenities amenities={property.amenities} className="mt-6" />
          </section>

          <section>
            <h2 className="font-serif text-xl">Highlights</h2>
            <ul className="mt-4 space-y-2">
              {property.highlights.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted">
                  <Icons.Check className="h-4 w-4 shrink-0 text-accent" aria-hidden />
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-serif text-xl">Location</h2>
            <p className="mt-2 text-sm text-muted">{property.address}</p>
            <ImagePlaceholder variant="map" seed={0} className="mt-4" />
          </section>

          {reviews.length > 0 && (
            <section id="reviews">
              <h2 className="font-serif text-xl">What clients say</h2>
              <div className="mt-6 space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b border-border pb-6 last:border-0">
                    <StarRating rating={review.rating} />
                    <p className="mt-3 text-sm leading-relaxed">{review.comment}</p>
                    <p className="mt-2 text-sm text-muted">
                      — {review.guestName}
                      <span className="text-xs"> · {review.role}</span>
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="hidden lg:block">
          <EnquiryCard property={property} />
        </div>
      </div>

      <MobileEnquiryBar property={property} />
    </div>
  );
}
