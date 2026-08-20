-- CreateEnum
CREATE TYPE "BlockSource" AS ENUM ('MANUAL', 'EXTERNAL');
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'WHATSAPP');
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'FAILED', 'SKIPPED');
CREATE TYPE "CalendarFeedKind" AS ENUM ('ICAL_EXPORT', 'ICAL_IMPORT', 'GOOGLE');

-- AlterTable PropertyBlock
ALTER TABLE "PropertyBlock" ADD COLUMN "source" "BlockSource" NOT NULL DEFAULT 'MANUAL';
ALTER TABLE "PropertyBlock" ADD COLUMN "externalUid" TEXT;
ALTER TABLE "PropertyBlock" ADD COLUMN "feedId" TEXT;
CREATE UNIQUE INDEX "PropertyBlock_propertyId_externalUid_key" ON "PropertyBlock"("propertyId", "externalUid");
CREATE INDEX "PropertyBlock_feedId_idx" ON "PropertyBlock"("feedId");

-- AlterTable Review
ALTER TABLE "Review" ADD COLUMN "bookingId" TEXT;
ALTER TABLE "Review" ADD COLUMN "guestId" TEXT;
CREATE UNIQUE INDEX "Review_bookingId_key" ON "Review"("bookingId");
ALTER TABLE "Review" ADD CONSTRAINT "Review_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "Review" ADD CONSTRAINT "Review_guestId_fkey" FOREIGN KEY ("guestId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateTable NotificationOutbox
CREATE TABLE "NotificationOutbox" (
    "id" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "template" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "idempotencyKey" TEXT NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastError" TEXT,
    "scheduledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationOutbox_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "NotificationOutbox_idempotencyKey_key" ON "NotificationOutbox"("idempotencyKey");
CREATE INDEX "NotificationOutbox_status_scheduledAt_idx" ON "NotificationOutbox"("status", "scheduledAt");

-- CreateTable CheckInOut
CREATE TABLE "CheckInOut" (
    "id" TEXT NOT NULL,
    "bookingId" TEXT NOT NULL,
    "checkedInAt" TIMESTAMP(3),
    "checkedOutAt" TIMESTAMP(3),
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CheckInOut_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CheckInOut_bookingId_key" ON "CheckInOut"("bookingId");
ALTER TABLE "CheckInOut" ADD CONSTRAINT "CheckInOut_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable CalendarFeed
CREATE TABLE "CalendarFeed" (
    "id" TEXT NOT NULL,
    "propertyId" TEXT NOT NULL,
    "kind" "CalendarFeedKind" NOT NULL,
    "importUrl" TEXT,
    "exportToken" TEXT,
    "googleRefreshToken" TEXT,
    "lastSyncedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CalendarFeed_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "CalendarFeed_exportToken_key" ON "CalendarFeed"("exportToken");
CREATE UNIQUE INDEX "CalendarFeed_propertyId_kind_key" ON "CalendarFeed"("propertyId", "kind");
CREATE INDEX "CalendarFeed_kind_enabled_idx" ON "CalendarFeed"("kind", "enabled");
ALTER TABLE "CalendarFeed" ADD CONSTRAINT "CalendarFeed_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable HostSettings
CREATE TABLE "HostSettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "whatsappAlerts" BOOLEAN NOT NULL DEFAULT false,
    "bookingReminders" BOOLEAN NOT NULL DEFAULT true,
    "whatsappNumber" TEXT,
    "directPaymentInstructions" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HostSettings_pkey" PRIMARY KEY ("id")
);
