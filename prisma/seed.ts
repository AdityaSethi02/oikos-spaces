import { PrismaClient, PropertyType, ReviewStatus } from "../src/generated/prisma";
import { seedProperties, seedReviews } from "./seed-data";

const prisma = new PrismaClient();

const propertyTypeMap: Record<string, PropertyType> = {
  Apartment: PropertyType.APARTMENT,
  Villa: PropertyType.VILLA,
  "Heritage Home": PropertyType.HERITAGE_HOME,
};

function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}

async function main() {
  console.log("Seeding database…");

  for (const amenityName of [
    "Wi-Fi",
    "Kitchen",
    "Parking",
    "TV",
    "Workspace",
    "Balcony",
    "Air conditioning",
    "Hot water",
    "Self check-in",
    "Washing machine",
    "Garden",
    "Rooftop terrace",
  ]) {
    await prisma.amenity.upsert({
      where: { name: amenityName },
      create: { name: amenityName },
      update: {},
    });
  }

  const amenityRecords = await prisma.amenity.findMany();
  const amenityByName = new Map(amenityRecords.map((a) => [a.name, a.id]));

  for (const p of seedProperties) {
    const property = await prisma.property.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        name: p.name,
        tagline: p.tagline,
        description: p.description,
        about: p.about,
        location: p.location,
        address: p.address,
        type: propertyTypeMap[p.type],
        guests: p.guests,
        bedrooms: p.bedrooms,
        beds: p.beds,
        bathrooms: p.bathrooms,
        basePricePaise: rupeesToPaise(p.pricePerNight),
        weekendPricePaise: rupeesToPaise(p.weekendPrice),
        cleaningFeePaise: rupeesToPaise(p.cleaningFee),
        checkInTime: p.checkIn.replace(/\s*(AM|PM)/i, "").trim() === "2:00"
          ? "14:00"
          : p.checkIn.includes("3:00")
            ? "15:00"
            : "14:00",
        checkOutTime: p.checkOut.includes("10:00") ? "10:00" : "11:00",
        cancellationPolicyText: p.cancellationPolicy,
        houseRules: p.houseRules,
        includedItems: p.included,
        highlights: p.highlights,
        galleryCount: p.galleryCount,
        ratingAverage: p.rating,
        reviewCount: p.reviewCount,
        isDemo: false,
        bedroomDetails: {
          create: p.bedroomDetails.map((bed, i) => ({
            name: bed.name,
            beds: bed.beds,
            sortOrder: i,
          })),
        },
      },
      update: {
        name: p.name,
        basePricePaise: rupeesToPaise(p.pricePerNight),
        ratingAverage: p.rating,
        reviewCount: p.reviewCount,
        isDemo: false,
      },
    });

    await prisma.propertyAmenity.deleteMany({ where: { propertyId: property.id } });
    for (const amenityName of p.amenities) {
      const amenityId = amenityByName.get(amenityName);
      if (amenityId) {
        await prisma.propertyAmenity.create({
          data: { propertyId: property.id, amenityId },
        });
      }
    }
  }

  const propertyByLegacyId = new Map<string, string>();
  const dbProperties = await prisma.property.findMany();
  for (const seed of seedProperties) {
    const dbProp = dbProperties.find((d) => d.slug === seed.slug);
    if (dbProp) propertyByLegacyId.set(seed.id, dbProp.id);
  }

  for (const r of seedReviews) {
    const propertyId = propertyByLegacyId.get(r.propertyId);
    if (!propertyId) continue;

    await prisma.review.upsert({
      where: { id: r.id },
      create: {
        id: r.id,
        propertyId,
        guestName: r.guestName,
        rating: r.rating,
        comment: r.comment,
        response: r.response,
        status: r.published ? ReviewStatus.PUBLISHED : ReviewStatus.PENDING,
        reviewDate: new Date(r.date),
        isDemo: false,
      },
      update: {
        comment: r.comment,
        status: r.published ? ReviewStatus.PUBLISHED : ReviewStatus.PENDING,
        isDemo: false,
      },
    });
  }

  const seedHostEmail = process.env.SEED_HOST_EMAIL ?? "admin@example.com";
  await prisma.hostAccount.upsert({
    where: { email: seedHostEmail.toLowerCase() },
    create: {
      email: seedHostEmail.toLowerCase(),
      name: "Admin Host",
      isActive: true,
    },
    update: { isActive: true },
  });
  console.log(`Host account allowlisted: ${seedHostEmail}`);

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
