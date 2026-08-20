"use client";

import {
  finishDocumentUploadAction,
  startDocumentUploadAction,
} from "@/app/actions/payment.actions";

export async function uploadGuestDocument(input: {
  file: File;
  bookingReference: string;
  conversationId?: string;
}) {
  const start = await startDocumentUploadAction({
    bookingReference: input.bookingReference,
    conversationId: input.conversationId,
    fileName: input.file.name,
    mimeType: input.file.type,
    sizeBytes: input.file.size,
  });
  if (!start.ok) return start;
  const put = await fetch(start.uploadUrl, {
    method: "PUT",
    body: input.file,
    headers: { "Content-Type": input.file.type },
  });
  if (!put.ok) {
    return { ok: false as const, error: "Could not upload the file" };
  }
  return finishDocumentUploadAction(start.documentId);
}
