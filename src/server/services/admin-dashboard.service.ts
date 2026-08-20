import prisma from "@/lib/prisma";
import { requireDatabase } from "@/server/lib/require-config";
import { paiseToRupees } from "@/server/lib/money";

function todayIst(): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
}

export async function getAdminDashboardStats() {
  requireDatabase();
  const today = todayIst();
  const todayDate = new Date(`${today}T00:00:00.000Z`);

  const [
    todayCheckIns,
    todayCheckOuts,
    upcomingBookings,
    pendingInquiries,
    pendingDirectPayments,
    pendingDocuments,
    activeProperties,
    capturedPayments,
    activeBookingNights,
    conversations,
  ] = await Promise.all([
    prisma.booking.count({
      where: { status: "CONFIRMED", checkInDate: todayDate },
    }),
    prisma.booking.count({
      where: { status: { in: ["CHECKED_IN", "CONFIRMED"] }, checkOutDate: todayDate },
    }),
    prisma.booking.count({
      where: { status: { in: ["INQUIRY", "RESERVED", "PAYMENT_PENDING", "CONFIRMED", "CHECKED_IN"] } },
    }),
    prisma.booking.count({ where: { status: "INQUIRY" } }),
    prisma.booking.count({
      where: {
        paymentMethod: "DIRECT",
        status: { in: ["INQUIRY", "PAYMENT_PENDING"] },
        payments: { none: { status: "CAPTURED" } },
      },
    }),
    prisma.guestDocument.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.property.count({ where: { status: "ACTIVE", deletedAt: null } }),
    prisma.payment.findMany({
      where: { status: "CAPTURED" },
      select: { amountPaise: true },
    }),
    prisma.booking.findMany({
      where: { status: { in: ["CONFIRMED", "CHECKED_IN"] } },
      select: { checkInDate: true, checkOutDate: true },
    }),
    prisma.conversation.findMany({
      select: { hostLastReadAt: true, lastMessageAt: true },
    }),
  ]);

  const unreadMessages = conversations.filter(
    (c) => !c.hostLastReadAt || c.lastMessageAt > c.hostLastReadAt,
  ).length;

  const totalRevenue = capturedPayments.reduce((sum, p) => sum + p.amountPaise, 0);
  const totalPropertyNights = activeProperties * 365;
  let occupiedNights = 0;
  for (const booking of activeBookingNights) {
    occupiedNights += Math.max(
      0,
      Math.round(
        (booking.checkOutDate.getTime() - booking.checkInDate.getTime()) / 86400000,
      ),
    );
  }
  const occupancy =
    totalPropertyNights > 0 ? Math.round((occupiedNights / totalPropertyNights) * 100) : 0;

  return {
    todayCheckIns,
    todayCheckOuts,
    upcomingBookings,
    pendingInquiries,
    pendingDirectPayments,
    pendingDocuments,
    unreadMessages,
    occupancy,
    totalRevenue: paiseToRupees(totalRevenue),
  };
}

export async function getUpcomingAdminBookings(limit = 5) {
  requireDatabase();
  const rows = await prisma.booking.findMany({
    where: { status: { in: ["INQUIRY", "RESERVED", "PAYMENT_PENDING", "CONFIRMED", "CHECKED_IN"] } },
    include: {
      property: { include: { amenities: { include: { amenity: true } }, bedroomDetails: true, media: true } },
      guest: true,
      payments: true,
      conversation: true,
      reviews: { select: { id: true } },
    },
    orderBy: { checkInDate: "asc" },
    take: limit,
  });
  const { toGuestBookingDto } = await import("@/server/mappers/booking.mapper");
  return rows.map((row) => toGuestBookingDto(row, { includePrivateAccess: true }));
}
