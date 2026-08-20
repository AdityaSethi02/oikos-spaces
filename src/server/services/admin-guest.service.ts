import prisma from "@/lib/prisma";
import { requireDatabase } from "@/server/lib/require-config";

export async function listAdminGuests() {
  requireDatabase();
  const guests = await prisma.user.findMany({
    where: { role: "GUEST", deletedAt: null },
    include: {
      bookingsAsGuest: {
        include: { property: true },
        orderBy: { createdAt: "desc" },
      },
      conversationsAsGuest: { select: { id: true } },
      documents: { select: { id: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return guests.map((guest) => ({
    id: guest.id,
    name: guest.name ?? guest.email,
    email: guest.email,
    phone: guest.phone ?? "",
    bookingCount: guest.bookingsAsGuest.length,
    conversationCount: guest.conversationsAsGuest.length,
    documentCount: guest.documents.length,
    lastBooking: guest.bookingsAsGuest[0]
      ? {
          reference: guest.bookingsAsGuest[0].bookingReference,
          propertyName: guest.bookingsAsGuest[0].property.name,
          status: guest.bookingsAsGuest[0].status,
        }
      : null,
  }));
}

export async function getAdminGuestDetail(guestId: string) {
  requireDatabase();
  const guest = await prisma.user.findFirst({
    where: { id: guestId, role: "GUEST", deletedAt: null },
    include: {
      bookingsAsGuest: {
        include: {
          property: { include: { amenities: { include: { amenity: true } }, bedroomDetails: true, media: true } },
          payments: true,
          conversation: true,
          reviews: { select: { id: true } },
        },
        orderBy: { createdAt: "desc" },
      },
      conversationsAsGuest: {
        include: { property: true, messages: { orderBy: { createdAt: "desc" }, take: 1 } },
        orderBy: { lastMessageAt: "desc" },
      },
      documents: {
        include: { booking: true },
        orderBy: { createdAt: "desc" },
      },
    },
  });
  if (!guest) return null;

  const { toGuestBookingDto } = await import("@/server/mappers/booking.mapper");
  return {
    id: guest.id,
    name: guest.name ?? guest.email,
    email: guest.email,
    phone: guest.phone ?? "",
    bookings: guest.bookingsAsGuest.map((b) => toGuestBookingDto(b, { includePrivateAccess: true })),
    conversations: guest.conversationsAsGuest.map((c) => ({
      id: c.id,
      propertyName: c.property.name,
      lastMessage: c.messages[0]?.body ?? "",
      lastMessageAt: c.lastMessageAt.toISOString(),
    })),
    documents: guest.documents.map((d) => ({
      id: d.id,
      fileName: d.fileName,
      bookingReference: d.booking.bookingReference,
      status: d.status,
      uploadedAt: d.createdAt.toISOString().slice(0, 10),
    })),
  };
}
