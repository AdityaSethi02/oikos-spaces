import prisma from "@/lib/prisma";
import { requireDatabase } from "@/server/lib/require-config";
import { formatDateOnly } from "@/server/lib/dates";

export type CalendarEvent = {
  id: string;
  propertyId: string;
  title: string;
  start: string;
  end: string;
  type: "confirmed" | "pending" | "blocked" | "checkin" | "checkout" | "external";
  notes?: string;
};

export async function listCalendarEvents(input?: { propertyId?: string }) {
  requireDatabase();
  const propertyFilter = input?.propertyId ? { propertyId: input.propertyId } : {};

  const [bookings, blocks] = await Promise.all([
    prisma.booking.findMany({
      where: {
        ...propertyFilter,
        status: { in: ["INQUIRY", "RESERVED", "PAYMENT_PENDING", "CONFIRMED", "CHECKED_IN"] },
      },
      include: { guest: true, property: true },
    }),
    prisma.propertyBlock.findMany({
      where: propertyFilter,
      orderBy: { startDate: "asc" },
    }),
  ]);

  const events: CalendarEvent[] = [];

  for (const booking of bookings) {
    const checkIn = formatDateOnly(booking.checkInDate);
    const checkOut = formatDateOnly(booking.checkOutDate);
    const guestName = booking.guest.name ?? booking.guest.email;
    const isPending = ["INQUIRY", "RESERVED", "PAYMENT_PENDING"].includes(booking.status);

    events.push({
      id: `booking-${booking.id}`,
      propertyId: booking.propertyId,
      title: `${guestName} — ${booking.property.name}`,
      start: checkIn,
      end: checkOut,
      type: isPending ? "pending" : "confirmed",
    });

    events.push({
      id: `checkin-${booking.id}`,
      propertyId: booking.propertyId,
      title: `Check-in: ${guestName}`,
      start: checkIn,
      end: checkIn,
      type: "checkin",
    });

    events.push({
      id: `checkout-${booking.id}`,
      propertyId: booking.propertyId,
      title: `Check-out: ${guestName}`,
      start: checkOut,
      end: checkOut,
      type: "checkout",
    });
  }

  for (const block of blocks) {
    events.push({
      id: `block-${block.id}`,
      propertyId: block.propertyId,
      title: block.source === "EXTERNAL" ? "External calendar block" : "Blocked",
      start: formatDateOnly(block.startDate),
      end: formatDateOnly(block.endDate),
      type: block.source === "EXTERNAL" ? "external" : "blocked",
      notes: block.notes ?? undefined,
    });
  }

  return events;
}
