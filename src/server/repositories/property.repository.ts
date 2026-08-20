import type {
  Amenity,
  Prisma,
  Property,
  PropertyBedroom,
  PropertyMedia,
  PropertyStatus,
  PropertyType,
  Review,
} from "@prisma/client";
import prisma from "@/lib/prisma";

export type PropertyWithRelations = Property & {
  bedroomDetails: PropertyBedroom[];
  amenities: { amenity: Amenity }[];
  media: PropertyMedia[];
  reviews?: Review[];
};

const propertyInclude = {
  bedroomDetails: { orderBy: { sortOrder: "asc" as const } },
  amenities: { include: { amenity: true } },
  media: { orderBy: { sortOrder: "asc" as const } },
} satisfies Prisma.PropertyInclude;

export const propertyRepository = {
  include: propertyInclude,

  findActiveAll() {
    return prisma.property.findMany({
      where: { status: "ACTIVE", deletedAt: null },
      include: propertyInclude,
      orderBy: { createdAt: "asc" },
    });
  },

  findAllForAdmin() {
    return prisma.property.findMany({
      where: { deletedAt: null },
      include: propertyInclude,
      orderBy: { createdAt: "asc" },
    });
  },

  findActiveBySlug(slug: string) {
    return prisma.property.findFirst({
      where: { slug, status: "ACTIVE", deletedAt: null },
      include: {
        ...propertyInclude,
        reviews: {
          where: { status: "PUBLISHED" },
          orderBy: { reviewDate: "desc" },
        },
      },
    });
  },

  findById(id: string) {
    return prisma.property.findFirst({
      where: { id, deletedAt: null },
      include: propertyInclude,
    });
  },

  findBySlugAny(slug: string) {
    return prisma.property.findFirst({
      where: { slug, deletedAt: null },
      include: propertyInclude,
    });
  },

  async create(input: {
    slug: string;
    name: string;
    tagline?: string;
    shortDescription?: string;
    description: string;
    about: string;
    location: string;
    address: string;
    type: PropertyType;
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
    basePricePaise: number;
    weekendPricePaise: number;
    cleaningFeePaise: number;
    amenityNames: string[];
  }) {
    return prisma.$transaction(async (tx) => {
      const amenities = input.amenityNames.length
        ? await tx.amenity.findMany({ where: { name: { in: input.amenityNames } } })
        : [];

      const property = await tx.property.create({
        data: {
          slug: input.slug,
          name: input.name,
          tagline: input.tagline,
          shortDescription: input.shortDescription,
          description: input.description,
          about: input.about,
          location: input.location,
          address: input.address,
          type: input.type,
          guests: input.guests,
          bedrooms: input.bedrooms,
          beds: input.beds,
          bathrooms: input.bathrooms,
          basePricePaise: input.basePricePaise,
          weekendPricePaise: input.weekendPricePaise,
          cleaningFeePaise: input.cleaningFeePaise,
          status: "ACTIVE",
        },
      });

      if (amenities.length) {
        await tx.propertyAmenity.createMany({
          data: amenities.map((amenity) => ({
            propertyId: property.id,
            amenityId: amenity.id,
          })),
        });
      }

      return tx.property.findUniqueOrThrow({
        where: { id: property.id },
        include: propertyInclude,
      });
    });
  },

  async updateAdmin(
    id: string,
    data: Prisma.PropertyUpdateInput,
    amenityNames: string[],
  ) {
    return prisma.$transaction(async (tx) => {
      const amenities = amenityNames.length
        ? await tx.amenity.findMany({ where: { name: { in: amenityNames } } })
        : [];
      await tx.propertyAmenity.deleteMany({ where: { propertyId: id } });
      if (amenities.length) {
        await tx.propertyAmenity.createMany({
          data: amenities.map((amenity) => ({
            propertyId: id,
            amenityId: amenity.id,
          })),
        });
      }

      return tx.property.update({
        where: { id },
        data,
        include: propertyInclude,
      });
    });
  },

  updateStatus(id: string, status: PropertyStatus) {
    return prisma.property.update({
      where: { id },
      data: { status },
      include: propertyInclude,
    });
  },
};
