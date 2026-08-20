import type { User } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ForbiddenError, NotFoundError, ValidationError } from "@/server/errors";
import { requireDatabase } from "@/server/lib/require-config";
import { formatDateOnly } from "@/server/lib/dates";
import { bookingRepository } from "@/server/repositories/booking.repository";

export type AdminReviewRow = {
  id: string;
  propertyName: string;
  guestName: string;
  rating: number;
  comment: string;
  date: string;
  published: boolean;
  response?: string;
};

async function refreshPropertyReviewStats(propertyId: string) {
  const published = await prisma.review.findMany({
    where: { propertyId, status: "PUBLISHED" },
    select: { rating: true },
  });
  const reviewCount = published.length;
  const ratingAverage =
    reviewCount === 0
      ? 0
      : published.reduce((sum, review) => sum + review.rating, 0) / reviewCount;
  await prisma.property.update({
    where: { id: propertyId },
    data: { reviewCount, ratingAverage },
  });
}

export async function listAdminReviews(): Promise<AdminReviewRow[]> {
  requireDatabase();
  const rows = await prisma.review.findMany({
    include: { property: true },
    orderBy: { reviewDate: "desc" },
  });
  return rows.map((review) => ({
    id: review.id,
    propertyName: review.property.name,
    guestName: review.guestName,
    rating: review.rating,
    comment: review.comment,
    date: formatDateOnly(review.reviewDate),
    published: review.status === "PUBLISHED",
    response: review.response ?? undefined,
  }));
}

export async function submitGuestReview(input: {
  user: User;
  bookingReference: string;
  rating: number;
  comment: string;
}) {
  requireDatabase();
  if (input.rating < 1 || input.rating > 5) {
    throw new ValidationError("Rating must be between 1 and 5");
  }
  if (!input.comment.trim()) {
    throw new ValidationError("Please add a short comment");
  }

  const booking = await bookingRepository.findByReference(input.bookingReference);
  if (!booking) throw new NotFoundError("Booking not found");
  if (booking.guestId !== input.user.id && input.user.role !== "ADMIN_HOST") {
    throw new ForbiddenError();
  }
  if (booking.status !== "COMPLETED") {
    throw new ValidationError("You can review after check-out");
  }

  const existing = await prisma.review.findUnique({ where: { bookingId: booking.id } });
  if (existing) throw new ValidationError("This stay already has a review");

  const review = await prisma.review.create({
    data: {
      propertyId: booking.propertyId,
      bookingId: booking.id,
      guestId: booking.guestId,
      guestName: booking.guest?.name ?? "Guest",
      rating: input.rating,
      comment: input.comment.trim(),
      status: "PENDING",
      reviewDate: new Date(),
    },
  });


  return review;
}

export async function moderateReview(input: {
  admin: User;
  reviewId: string;
  published?: boolean;
  response?: string;
}) {
  const review = await prisma.review.findUnique({ where: { id: input.reviewId } });
  if (!review) throw new NotFoundError("Review not found");

  const status =
    input.published === undefined
      ? undefined
      : input.published
        ? "PUBLISHED"
        : "HIDDEN";

  const updated = await prisma.review.update({
    where: { id: review.id },
    data: {
      ...(status ? { status } : {}),
      ...(input.response !== undefined ? { response: input.response } : {}),
    },
  });

  await refreshPropertyReviewStats(review.propertyId);
  return updated;
}
