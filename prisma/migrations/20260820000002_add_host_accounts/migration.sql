-- CreateTable
CREATE TABLE "HostAccount" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HostAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HostAccount_email_key" ON "HostAccount"("email");

-- CreateIndex
CREATE INDEX "HostAccount_email_idx" ON "HostAccount"("email");

-- CreateIndex
CREATE INDEX "HostAccount_isActive_idx" ON "HostAccount"("isActive");
