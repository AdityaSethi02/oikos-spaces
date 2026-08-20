import type { PropertyType as DbPropertyType } from "@prisma/client";
import type { PropertyType } from "@/server/dto/domain.dto";
import type { AdminPropertyDto, PublicPropertyDto, PublicReviewDto } from "@/server/dto/public.dto";
import type { PropertyWithRelations } from "@/server/repositories/property.repository";
import { env } from "@/lib/env";
import { paiseToRupees } from "@/server/lib/money";

const TYPE_TO_LABEL: Record<DbPropertyType, PropertyType> = {
  APARTMENT: "Apartment",
  VILLA: "Villa",
  HERITAGE_HOME: "Heritage Home",
};

export const LABEL_TO_TYPE: Record<PropertyType, DbPropertyType> = {
  Apartment: "APARTMENT",
  Villa: "VILLA",
  "Heritage Home": "HERITAGE_HOME",
};

function formatClock(hhmm: string): string {
  const [hourRaw, minuteRaw] = hhmm.split(":");
  const hour = Number(hourRaw);
  const minute = Number(minuteRaw ?? 0);
  if (Number.isNaN(hour)) return hhmm;
  const suffix = hour >= 12 ? "PM" : "AM";
  const hour12 = hour % 12 || 12;
  return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

function asStringArray(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function decimalToNumber(value: { toString(): string } | null | undefined): number | undefined {
  if (value == null) return undefined;
  const n = Number(value.toString());
  return Number.isFinite(n) ? n : undefined;
}

export function resolveMediaUrl(media: {
  url: string;
  storageKey: string | null;
}): string {
  if (media.url.startsWith("http://") || media.url.startsWith("https://")) {
    return media.url;
  }
  if (media.storageKey && env.R2_PUBLIC_BASE_URL) {
    return `${env.R2_PUBLIC_BASE_URL.replace(/\/$/, "")}/${media.storageKey}`;
  }
  return media.url;
}

function basePropertyFields(property: PropertyWithRelations) {
  const media = property.media.map((item) => ({
    id: item.id,
    kind: item.kind,
    url: resolveMediaUrl(item),
    alt: item.alt ?? undefined,
    sortOrder: item.sortOrder,
    isFeatured: item.isFeatured,
    playbackId: item.playbackId ?? undefined,
  }));

  return {
    id: property.id,
    slug: property.slug,
    name: property.name,
    tagline: property.tagline ?? "",
    location: property.location,
    address: property.address,
    type: TYPE_TO_LABEL[property.type],
    description: property.description,
    about: property.about ?? property.description,
    guests: property.guests,
    bedrooms: property.bedrooms,
    beds: property.beds,
    bathrooms: property.bathrooms,
    pricePerNight: paiseToRupees(property.basePricePaise),
    weekendPrice: paiseToRupees(property.weekendPricePaise ?? property.basePricePaise),
    cleaningFee: paiseToRupees(property.cleaningFeePaise),
    rating: Number(property.ratingAverage),
    reviewCount: property.reviewCount,
    amenities: property.amenities.map(
      (row) => row.amenity.name as PublicPropertyDto["amenities"][number],
    ),
    bedroomDetails: property.bedroomDetails.map((bed) => ({
      name: bed.name,
      beds: bed.beds,
    })),
    included: asStringArray(property.includedItems),
    houseRules: asStringArray(property.houseRules),
    cancellationPolicy: property.cancellationPolicyText ?? "",
    checkIn: formatClock(property.checkInTime),
    checkOut: formatClock(property.checkOutTime),
    isDemo: property.isDemo,
    galleryCount: property.media.length || property.galleryCount,
    highlights: asStringArray(property.highlights),
    media,
    status: property.status,
    latitude: decimalToNumber(property.latitude),
    longitude: decimalToNumber(property.longitude),
  };
}

export function toPublicPropertyDto(property: PropertyWithRelations): PublicPropertyDto {
  return basePropertyFields(property);
}

export function toAdminPropertyDto(property: PropertyWithRelations): AdminPropertyDto {
  return {
    ...basePropertyFields(property),
    arrivalInstructions: property.arrivalInstructions ?? undefined,
    accessInstructions: property.accessInstructions ?? undefined,
    parkingInstructions: property.parkingInstructions ?? undefined,
    contactPhone: property.contactPhone ?? undefined,
  };
}

export function toPublicReviewDto(
  review: {
    id: string;
    propertyId: string;
    guestName: string;
    rating: number;
    comment: string;
    reviewDate: Date;
    response: string | null;
  },
): PublicReviewDto {
  return {
    id: review.id,
    propertyId: review.propertyId,
    guestName: review.guestName,
    rating: review.rating,
    comment: review.comment,
    date: review.reviewDate.toISOString().slice(0, 10),
    response: review.response ?? undefined,
  };
}
