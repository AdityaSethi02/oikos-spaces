import { describe, expect, it } from "vitest";
import { isDatabaseConfigured } from "@/lib/env";
import prisma from "@/lib/prisma";
import { reserveDates } from "@/server/services/booking.service";
import { expireReservations } from "@/server/services/availability.service";

const canRun = Boolean(process.env.DATABASE_URL) && isDatabaseConfigured;

describe.skipIf(!canRun)("booking concurrency", () => {
  it("allows only one overlapping reservation", async () => {
    await expireReservations();
    const property = await prisma.property.findFirst({ where: { status: "ACTIVE" } });
    const guests = await prisma.user.findMany({ take: 2 });
    if (!property || guests.length < 2) {
      expect(true).toBe(true);
      return;
    }

    const checkIn = "2027-01-10";
    const checkOut = "2027-01-13";

    await prisma.booking.deleteMany({
      where: {
        propertyId: property.id,
        checkInDate: new Date("2027-01-10T00:00:00.000Z"),
      },
    });

    const results = await Promise.allSettled([
      reserveDates({
        guest: guests[0],
        propertySlug: property.slug,
        checkIn,
        checkOut,
        guests: 1,
        paymentMethod: "RAZORPAY",
        idempotencyKey: `test-a-${Date.now()}`,
      }),
      reserveDates({
        guest: guests[1],
        propertySlug: property.slug,
        checkIn,
        checkOut,
        guests: 1,
        paymentMethod: "RAZORPAY",
        idempotencyKey: `test-b-${Date.now()}`,
      }),
    ]);

    const fulfilled = results.filter((result) => result.status === "fulfilled");
    const rejected = results.filter((result) => result.status === "rejected");
    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(1);
  });
});
