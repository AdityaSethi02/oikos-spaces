import { randomUUID } from "crypto";
import type { User } from "@prisma/client";
import { isR2Configured } from "@/lib/env";
import { ForbiddenError, NotFoundError, ValidationError } from "@/server/errors";
import { createPresignedGetUrl, createPresignedPutUrl, objectExists } from "@/server/integrations/r2/client";
import prisma from "@/lib/prisma";
import { bookingRepository } from "@/server/repositories/booking.repository";
import { getConversationForUser, sendMessage } from "@/server/services/chat.service";

const ALLOWED_MIME = new Set(["application/pdf", "image/jpeg", "image/png"]);
const MAX_BYTES = 10 * 1024 * 1024;

export async function createDocumentUpload(input: {
  user: User;
  bookingReference: string;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  conversationId?: string;
}) {
  if (!isR2Configured) {
    throw new ValidationError("Secure document storage is not configured");
  }
  if (!ALLOWED_MIME.has(input.mimeType)) {
    throw new ValidationError("Use PDF, JPG, or PNG");
  }
  if (input.sizeBytes > MAX_BYTES) {
    throw new ValidationError("File must be under 10 MB");
  }

  const booking = await bookingRepository.findByReference(input.bookingReference);
  if (!booking) throw new NotFoundError("Booking not found");
  if (booking.guestId !== input.user.id && input.user.role !== "ADMIN_HOST") {
    throw new ForbiddenError();
  }

  if (input.conversationId) {
    await getConversationForUser(input.user, input.conversationId);
  }

  const key = `documents/${booking.id}/${randomUUID()}-${input.fileName.replace(/[^\w.\-]+/g, "_")}`;
  const uploadUrl = await createPresignedPutUrl({
    key,
    contentType: input.mimeType,
  });

  const document = await prisma.guestDocument.create({
    data: {
      bookingId: booking.id,
      guestId: booking.guestId,
      conversationId: input.conversationId,
      storageKey: key,
      fileName: input.fileName,
      mimeType: input.mimeType,
      sizeBytes: input.sizeBytes,
    },
  });


  return { documentId: document.id, uploadUrl };
}

export async function completeDocumentUpload(input: {
  user: User;
  documentId: string;
}) {
  const document = await prisma.guestDocument.findUnique({
    where: { id: input.documentId },
    include: { booking: true },
  });
  if (!document) throw new NotFoundError("Document not found");
  if (document.guestId !== input.user.id && input.user.role !== "ADMIN_HOST") {
    throw new ForbiddenError();
  }

  const exists = await objectExists(document.storageKey);
  if (!exists) {
    await prisma.guestDocument.delete({ where: { id: document.id } });
    throw new ValidationError("Upload was not completed. Try again.");
  }

  if (document.conversationId) {
    await sendMessage({
      user: input.user,
      conversationId: document.conversationId,
      body: document.fileName,
      kind: document.mimeType.startsWith("image/") ? "IMAGE" : "DOCUMENT",
      attachment: {
        key: document.storageKey,
        name: document.fileName,
        mime: document.mimeType,
        size: document.sizeBytes,
      },
    });
  }


  return document;
}

export async function getAdminDocumentViewUrl(input: {
  admin: User;
  documentId: string;
}) {
  const document = await prisma.guestDocument.findUnique({ where: { id: input.documentId } });
  if (!document) throw new NotFoundError("Document not found");

  const url = await createPresignedGetUrl({
    key: document.storageKey,
    fileName: document.fileName,
    expiresIn: 60,
  });


  return url;
}

export async function listAdminDocuments() {
  const documents = await prisma.guestDocument.findMany({
    include: {
      guest: true,
      booking: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return documents.map((doc) => ({
    id: doc.id,
    guestName: doc.guest.name ?? doc.guest.email,
    bookingId: doc.booking.bookingReference,
    documentType: doc.documentType.replaceAll("_", " "),
    fileName: doc.fileName,
    uploadedAt: doc.createdAt.toISOString().slice(0, 10),
    status:
      doc.status === "PENDING_REVIEW"
        ? ("pending_review" as const)
        : doc.status === "VERIFIED"
          ? ("verified" as const)
          : ("rejected" as const),
  }));
}
