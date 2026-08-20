import prisma from "@/lib/prisma";
import { isDatabaseConfigured } from "@/lib/env";
import { addDays, formatDateOnly, todayInTimeZone } from "@/server/lib/dates";
import {
  enqueueGuestAndHost,
  enqueueNotification,
  getHostSettings,
  listHostEmails,
} from "@/server/services/notification.service";

export async function recordCheckIn(bookingId: string) {
  if (!isDatabaseConfigured) return;
  await prisma.checkInOut.upsert({
    where: { bookingId },
    create: { bookingId, checkedInAt: new Date() },
    update: { checkedInAt: new Date() },
  });
}

export async function recordCheckOut(bookingId: string) {
  if (!isDatabaseConfigured) return;
  await prisma.checkInOut.upsert({
    where: { bookingId },
    create: { bookingId, checkedOutAt: new Date() },
    update: { checkedOutAt: new Date() },
  });
}

export async function enqueueStayReminders() {
  if (!isDatabaseConfigured) return { queued: 0, skipped: true as const };
  const settings = await getHostSettings();
  if (!settings.bookingReminders) return { queued: 0 };

  const today = todayInTimeZone();
  const tomorrow = addDays(today, 1);
  let queued = 0;

  const arriving = await prisma.booking.findMany({
    where: { status: "CONFIRMED", checkInDate: new Date(tomorrow) },
    include: { guest: true, property: true },
  });
  for (const booking of arriving) {
    await enqueueGuestAndHost({
      template: "CHECKIN_REMINDER",
      guestEmail: booking.guest.email,
      guestPhone: booking.guest.phone,
      payload: {
        guestName: booking.guest.name ?? undefined,
        propertyName: booking.property.name,
        bookingReference: booking.bookingReference,
        checkIn: formatDateOnly(booking.checkInDate),
        checkOut: formatDateOnly(booking.checkOutDate),
      },
      idempotencyKey: `checkin-reminder:${booking.id}:${tomorrow}`,
    });
    queued += 1;
  }

  const departing = await prisma.booking.findMany({
    where: {
      status: { in: ["CONFIRMED", "CHECKED_IN"] },
      checkOutDate: new Date(tomorrow),
    },
    include: { guest: true, property: true },
  });
  for (const booking of departing) {
    await enqueueGuestAndHost({
      template: "CHECKOUT_REMINDER",
      guestEmail: booking.guest.email,
      guestPhone: booking.guest.phone,
      payload: {
        guestName: booking.guest.name ?? undefined,
        propertyName: booking.property.name,
        bookingReference: booking.bookingReference,
        checkIn: formatDateOnly(booking.checkInDate),
        checkOut: formatDateOnly(booking.checkOutDate),
      },
      idempotencyKey: `checkout-reminder:${booking.id}:${tomorrow}`,
    });
    queued += 1;
  }

  const reviewDue = await prisma.booking.findMany({
    where: {
      status: "COMPLETED",
      checkOutDate: new Date(addDays(today, -1)),
      reviews: { none: {} },
    },
    include: { guest: true, property: true },
  });
  for (const booking of reviewDue) {
    await enqueueGuestAndHost({
      template: "REVIEW_REQUEST",
      guestEmail: booking.guest.email,
      guestPhone: booking.guest.phone,
      payload: {
        guestName: booking.guest.name ?? undefined,
        propertyName: booking.property.name,
        bookingReference: booking.bookingReference,
      },
      idempotencyKey: `review-request:${booking.id}`,
    });
    queued += 1;
  }

  return { queued };
}

export async function notifyBookingConfirmed(bookingId: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { guest: true, property: true },
  });
  if (!booking) return;
  await enqueueGuestAndHost({
    template: "BOOKING_CONFIRMED",
    guestEmail: booking.guest.email,
    guestPhone: booking.guest.phone,
    payload: {
      guestName: booking.guest.name ?? undefined,
      propertyName: booking.property.name,
      bookingReference: booking.bookingReference,
      checkIn: formatDateOnly(booking.checkInDate),
      checkOut: formatDateOnly(booking.checkOutDate),
    },
    idempotencyKey: `booking-confirmed:${booking.id}`,
  });
}

export async function notifyInquiry(bookingId: string, message: string) {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: { guest: true, property: true },
  });
  if (!booking) return;
  const hosts = await listHostEmails();
  for (const email of hosts) {
    await enqueueNotification({
      channel: "EMAIL",
      template: "INQUIRY_RECEIVED",
      recipient: email,
      payload: {
        guestName: booking.guest.name ?? booking.guest.email,
        propertyName: booking.property.name,
        bookingReference: booking.bookingReference,
        checkIn: formatDateOnly(booking.checkInDate),
        checkOut: formatDateOnly(booking.checkOutDate),
        message,
      },
      idempotencyKey: `inquiry:${booking.id}:${email}`,
    });
  }
}
