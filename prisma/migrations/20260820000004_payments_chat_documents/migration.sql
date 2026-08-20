-- CreateEnum
CREATE TYPE "MessageKind" AS ENUM ('TEXT', 'IMAGE', 'DOCUMENT', 'SYSTEM');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('PENDING_REVIEW', 'VERIFIED', 'REJECTED');

-- CreateTable
CREATE TABLE "Refund" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT NOT NULL,
    "amountPaise" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "providerRefundId" TEXT,
    "reason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentWebhookEvent" (
    "id" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "payload" JSONB NOT NULL,

    CONSTRAINT "PaymentWebhookEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GuestDocument" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "guestId" TEXT NOT NULL,
    "conversationId" TEXT,
    "storageKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "documentType" TEXT NOT NULL DEFAULT 'GOVERNMENT_ID',
    "status" "DocumentStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuestDocument_pkey" PRIMARY KEY ("id")
);

-- Alter Conversation: add guest/tags/read receipts
ALTER TABLE "Conversation" ADD COLUMN "guestId" TEXT;
ALTER TABLE "Conversation" ADD COLUMN "tags" TEXT[] DEFAULT ARRAY[]::TEXT[];
ALTER TABLE "Conversation" ADD COLUMN "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Conversation" ADD COLUMN "guestLastReadAt" TIMESTAMP(3);
ALTER TABLE "Conversation" ADD COLUMN "hostLastReadAt" TIMESTAMP(3);

UPDATE "Conversation" AS c
SET "guestId" = b."guestId"
FROM "Booking" AS b
WHERE c."bookingId" = b."id" AND c."guestId" IS NULL;

DELETE FROM "Conversation" WHERE "guestId" IS NULL;

ALTER TABLE "Conversation" ALTER COLUMN "guestId" SET NOT NULL;

-- Alter ConversationMessage
ALTER TABLE "ConversationMessage" ADD COLUMN "kind" "MessageKind" NOT NULL DEFAULT 'TEXT';
ALTER TABLE "ConversationMessage" ADD COLUMN "attachmentKey" TEXT;
ALTER TABLE "ConversationMessage" ADD COLUMN "attachmentName" TEXT;
ALTER TABLE "ConversationMessage" ADD COLUMN "attachmentMime" TEXT;
ALTER TABLE "ConversationMessage" ADD COLUMN "attachmentSize" INTEGER;

-- CreateIndex
CREATE INDEX "Refund_paymentId_idx" ON "Refund"("paymentId");
CREATE INDEX "PaymentWebhookEvent_eventType_idx" ON "PaymentWebhookEvent"("eventType");
CREATE INDEX "Conversation_guestId_lastMessageAt_idx" ON "Conversation"("guestId", "lastMessageAt");
CREATE INDEX "Conversation_propertyId_idx" ON "Conversation"("propertyId");
CREATE INDEX "GuestDocument_bookingId_idx" ON "GuestDocument"("bookingId");
CREATE INDEX "GuestDocument_status_idx" ON "GuestDocument"("status");

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "GuestDocument" ADD CONSTRAINT "GuestDocument_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "GuestDocument" ADD CONSTRAINT "GuestDocument_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "GuestDocument" ADD CONSTRAINT "GuestDocument_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
