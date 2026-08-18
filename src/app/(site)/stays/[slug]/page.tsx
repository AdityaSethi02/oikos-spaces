import Link from "next/link";
import { notFound } from "next/navigation";
import { PropertyGallery } from "@/components/property/property-gallery";
import { PropertyAmenities } from "@/components/property/property-amenities";
import { BookingCard, MobileBookingBar } from "@/components/booking/booking-card";
import { ImagePlaceholder } from "@/components/media/image-placeholder";
import { PropertyActions } from "@/components/property/property-actions";
import { StarRating, PropertyMeta } from "@/components/property/property-meta";
import { getPropertyBySlug } from "@/data/mock/properties";
import { getReviewsByPropertyId } from "@/data/mock/reviews";

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
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/stays" className="hover:text-foreground">Stays</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{property.name}</span>
        </nav>

        <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl">
              {property.name}
            </h1>
            <p className="mt-1 text-muted">{property.location}</p>
          </div>
          <div className="flex items-center gap-4">
            <StarRating rating={property.rating} reviewCount={property.reviewCount} size="md" />
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
          {/* Quick stats */}
          <div>
            <p className="text-lg font-medium">{property.type} · Entire home</p>
            <PropertyMeta
              className="mt-2"
              guests={property.guests}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              beds={property.beds}
            />
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted">
              <span>Check-in {property.checkIn}</span>
              <span>Check-out {property.checkOut}</span>
              <span>Self check-in</span>
              <span>Parking</span>
              <span>Wi-Fi</span>
            </div>
          </div>

          <hr className="border-border" />

          {/* About */}
          <section>
            <h2 className="font-serif text-xl">About this place</h2>
            <p className="mt-4 leading-relaxed text-muted">{property.about}</p>
          </section>

          {/* Amenities */}
          <section>
            <h2 className="font-serif text-xl">Amenities</h2>
            <PropertyAmenities amenities={property.amenities} className="mt-6" />
          </section>

          {/* Sleeping */}
          <section>
            <h2 className="font-serif text-xl">Sleeping arrangements</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {property.bedroomDetails.map((bed) => (
                <div key={bed.name} className="rounded-xl border border-border overflow-hidden">
                  <ImagePlaceholder variant="bedroom" className="rounded-none rounded-t-xl" />
                  <div className="p-4">
                    <p className="font-medium">{bed.name}</p>
                    <p className="text-sm text-muted">{bed.beds}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <ImagePlaceholder variant="bathroom" label="Bathroom" />
              <ImagePlaceholder variant="video" label="Video Tour" />
            </div>
          </section>

          {/* Included */}
          <section>
            <h2 className="font-serif text-xl">What&apos;s included</h2>
            <ul className="mt-4 space-y-2">
              {property.included.map((item) => (
                <li key={item} className="flex items-center gap-2 text-sm text-muted">
                  <span className="text-accent">✓</span> {item}
                </li>
              ))}
            </ul>
          </section>

          {/* Location */}
          <section>
            <h2 className="font-serif text-xl">Location</h2>
            <p className="mt-2 text-sm text-muted">{property.address}</p>
            <ImagePlaceholder variant="map" className="mt-4" />
          </section>

          {/* House rules */}
          <section>
            <h2 className="font-serif text-xl">House rules</h2>
            <ul className="mt-4 space-y-2">
              {property.houseRules.map((rule) => (
                <li key={rule} className="text-sm text-muted">· {rule}</li>
              ))}
            </ul>
          </section>

          {/* Cancellation */}
          <section>
            <h2 className="font-serif text-xl">Cancellation policy</h2>
            <p className="mt-4 text-sm text-muted">{property.cancellationPolicy}</p>
          </section>

          {/* Reviews */}
          <section id="reviews">
            <h2 className="font-serif text-xl">Reviews</h2>
            <div className="mt-6 space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b border-border pb-6 last:border-0">
                  <StarRating rating={review.rating} />
                  <p className="mt-3 text-sm leading-relaxed">{review.comment}</p>
                  <p className="mt-2 text-sm text-muted">— {review.guestName}</p>
                  {review.response && (
                    <p className="mt-3 rounded-lg bg-background p-4 text-sm text-muted">
                      <span className="font-medium text-foreground">Host response:</span>{" "}
                      {review.response}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="hidden lg:block">
          <BookingCard property={property} />
        </div>
      </div>

      <MobileBookingBar property={property} slug={property.slug} />
    </div>
  );
}
