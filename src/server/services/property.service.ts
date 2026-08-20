import prisma from "@/lib/prisma";
import { requireDatabase } from "@/server/lib/require-config";
import type { AdminPropertyDto, PublicPropertyDto, PublicReviewDto, QuoteDto } from "@/server/dto/public.dto";
import { NotFoundError } from "@/server/errors";
import { rupeesToPaise } from "@/server/lib/money";
import {
  LABEL_TO_TYPE,
  toAdminPropertyDto,
  toPublicPropertyDto,
  toPublicReviewDto,
} from "@/server/mappers/property.mapper";
import { propertyRepository } from "@/server/repositories/property.repository";
import { getActivePricingRulesForStay } from "@/server/services/pricing-rule.service";
import { quoteStay, toPricedProperty } from "@/server/services/pricing.service";
import { isRangeAvailable } from "@/server/services/availability.service";
import type { PropertyStatus, PropertyType as DbPropertyType } from "@prisma/client";

export async function listPublicProperties(): Promise<PublicPropertyDto[]> {
  requireDatabase();
  const rows = await propertyRepository.findActiveAll();
  return rows.map(toPublicPropertyDto);
}

export async function listAllPropertiesForAdmin(): Promise<PublicPropertyDto[]> {
  requireDatabase();
  const rows = await propertyRepository.findAllForAdmin();
  return rows.map(toPublicPropertyDto);
}

export async function getPublicPropertyBySlug(slug: string): Promise<PublicPropertyDto | null> {
  requireDatabase();
  const row = await propertyRepository.findActiveBySlug(slug);
  return row ? toPublicPropertyDto(row) : null;
}

export async function getPropertyBySlugForAdmin(slug: string) {
  requireDatabase();
  return propertyRepository.findBySlugAny(slug);
}

export async function getPublicPropertyById(id: string): Promise<PublicPropertyDto | null> {
  requireDatabase();
  const row = await propertyRepository.findById(id);
  if (!row || row.status !== "ACTIVE") return null;
  return toPublicPropertyDto(row);
}

export async function listPublishedReviews(propertyId: string): Promise<PublicReviewDto[]> {
  requireDatabase();
  const reviews = await prisma.review.findMany({
    where: { propertyId, status: "PUBLISHED" },
    orderBy: { reviewDate: "desc" },
  });
  return reviews.map(toPublicReviewDto);
}

export async function getPropertyDetail(slug: string): Promise<{
  property: PublicPropertyDto;
  reviews: PublicReviewDto[];
} | null> {
  requireDatabase();
  const row = await propertyRepository.findActiveBySlug(slug);
  if (!row) return null;
  return {
    property: toPublicPropertyDto(row),
    reviews: (row.reviews ?? []).map(toPublicReviewDto),
  };
}

export async function listAvailablePublicProperties(input: {
  checkIn: string;
  checkOut: string;
}): Promise<PublicPropertyDto[]> {
  const all = await listPublicProperties();
  const available: PublicPropertyDto[] = [];
  for (const property of all) {
    if (await isRangeAvailable(property.id, input.checkIn, input.checkOut)) {
      available.push(property);
    }
  }
  return available;
}

function parseClock(value: string, fallback: string): string {
  if (/^\d{2}:\d{2}$/.test(value)) return value;
  const match = value.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (!match) return fallback;
  let hour = Number(match[1]);
  const minute = match[2];
  const mer = match[3].toUpperCase();
  if (mer === "PM" && hour < 12) hour += 12;
  if (mer === "AM" && hour === 12) hour = 0;
  return `${String(hour).padStart(2, "0")}:${minute}`;
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createPropertyFromAdmin(input: {
  actorId: string;
  name: string;
  slug?: string;
  tagline?: string;
  shortDescription?: string;
  description: string;
  location: string;
  address: string;
  type: keyof typeof LABEL_TO_TYPE | string;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  basePriceRupees: number;
  weekendPriceRupees?: number;
  cleaningFeeRupees?: number;
  amenities?: string[];
}) {
  requireDatabase();
  const slug = input.slug?.trim() || slugify(input.name);
  const existing = await propertyRepository.findBySlugAny(slug);
  if (existing) throw new NotFoundError("A property with this slug already exists");

  const type =
    input.type in LABEL_TO_TYPE
      ? LABEL_TO_TYPE[input.type as keyof typeof LABEL_TO_TYPE]
      : ("APARTMENT" as DbPropertyType);

  const property = await propertyRepository.create({
    slug,
    name: input.name,
    tagline: input.tagline,
    shortDescription: input.shortDescription,
    description: input.description,
    about: input.description,
    location: input.location,
    address: input.address,
    type,
    guests: input.guests,
    bedrooms: input.bedrooms,
    beds: input.beds,
    bathrooms: input.bathrooms,
    basePricePaise: rupeesToPaise(input.basePriceRupees),
    weekendPricePaise: rupeesToPaise(input.weekendPriceRupees ?? input.basePriceRupees),
    cleaningFeePaise: rupeesToPaise(input.cleaningFeeRupees ?? 0),
    amenityNames: input.amenities ?? [],
  });


  return toPublicPropertyDto(property);
}

export async function updatePropertyFromAdmin(input: {
  id: string;
  actorId: string;
  name: string;
  location: string;
  address: string;
  type: keyof typeof LABEL_TO_TYPE | string;
  about: string;
  guests: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  basePriceRupees: number;
  weekendPriceRupees: number;
  cleaningFeeRupees: number;
  amenities: string[];
  checkInTime: string;
  checkOutTime: string;
  cancellationPolicyText: string;
  houseRules?: string[];
  arrivalInstructions?: string;
  accessInstructions?: string;
  parkingInstructions?: string;
  contactPhone?: string;
  latitude?: number;
  longitude?: number;
}) {
  requireDatabase();
  const existing = await propertyRepository.findById(input.id);
  if (!existing) throw new NotFoundError("Property not found");

  const type =
    input.type in LABEL_TO_TYPE
      ? LABEL_TO_TYPE[input.type as keyof typeof LABEL_TO_TYPE]
      : existing.type;

  const updated = await propertyRepository.updateAdmin(
    input.id,
    {
      name: input.name,
      location: input.location,
      address: input.address,
      type,
      about: input.about,
      description: input.about,
      guests: input.guests,
      bedrooms: input.bedrooms,
      beds: input.beds,
      bathrooms: input.bathrooms,
      basePricePaise: rupeesToPaise(input.basePriceRupees),
      weekendPricePaise: rupeesToPaise(input.weekendPriceRupees),
      cleaningFeePaise: rupeesToPaise(input.cleaningFeeRupees),
      checkInTime: parseClock(input.checkInTime, existing.checkInTime),
      checkOutTime: parseClock(input.checkOutTime, existing.checkOutTime),
      cancellationPolicyText: input.cancellationPolicyText,
      houseRules: input.houseRules ?? [],
      arrivalInstructions: input.arrivalInstructions,
      accessInstructions: input.accessInstructions,
      parkingInstructions: input.parkingInstructions,
      contactPhone: input.contactPhone,
      latitude: input.latitude,
      longitude: input.longitude,
    },
    input.amenities,
  );


  return toPublicPropertyDto(updated);
}

export async function setPropertyStatus(input: {
  id: string;
  actorId: string;
  status: PropertyStatus;
}) {
  requireDatabase();
  const existing = await propertyRepository.findById(input.id);
  if (!existing) throw new NotFoundError("Property not found");

  const updated = await propertyRepository.updateAdmin(input.id, { status: input.status }, []);
  return toPublicPropertyDto(updated);
}

export async function getAdminPropertyById(id: string): Promise<AdminPropertyDto | null> {
  requireDatabase();
  const row = await propertyRepository.findById(id);
  return row ? toAdminPropertyDto(row) : null;
}

export async function getStayQuote(input: {
  slug: string;
  checkIn: string;
  checkOut: string;
  guests: number;
}): Promise<QuoteDto> {
  requireDatabase();
  const property = await propertyRepository.findActiveBySlug(input.slug);
  if (!property) throw new NotFoundError("Property not found");
  const rules = await getActivePricingRulesForStay(property.id, input.checkIn, input.checkOut);
  return quoteStay({
    property: toPricedProperty(property),
    checkIn: input.checkIn,
    checkOut: input.checkOut,
    guests: input.guests,
    rules,
  });
}
