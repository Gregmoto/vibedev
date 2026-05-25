-- CreateTable
CREATE TABLE "LeadMagnetSubscriber" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadMagnetSubscriber_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LeadMagnetSubscriber_email_key" ON "LeadMagnetSubscriber"("email");

-- CreateIndex
CREATE INDEX "LeadMagnetSubscriber_createdAt_idx" ON "LeadMagnetSubscriber"("createdAt");

-- CreateIndex
CREATE INDEX "LeadMagnetSubscriber_source_idx" ON "LeadMagnetSubscriber"("source");
