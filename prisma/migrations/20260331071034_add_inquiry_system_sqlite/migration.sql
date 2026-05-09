-- CreateTable
CREATE TABLE "Inquiry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'NEW',
    "fullName" TEXT NOT NULL,
    "phone" TEXT,
    "email" TEXT,
    "notes" TEXT,
    "trainingProgram" TEXT,
    "experienceLevel" TEXT,
    "preferredMonth" TEXT,
    "participantCount" INTEGER,
    "charterWeekId" TEXT,
    "charterStartDate" DATETIME,
    "charterEndDate" DATETIME,
    "charterDurationWeeks" INTEGER,
    "guestCount" INTEGER,
    "routePreference" TEXT,
    "boatPreference" TEXT,
    "skipperRequired" BOOLEAN,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Inquiry_charterWeekId_fkey" FOREIGN KEY ("charterWeekId") REFERENCES "CharterAvailability" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "CharterAvailability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "weekLabel" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "boatId" TEXT,
    "routeLabel" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CharterAvailability_boatId_fkey" FOREIGN KEY ("boatId") REFERENCES "CharterBoat" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Inquiry_type_idx" ON "Inquiry"("type");

-- CreateIndex
CREATE INDEX "Inquiry_status_idx" ON "Inquiry"("status");

-- CreateIndex
CREATE INDEX "Inquiry_createdAt_idx" ON "Inquiry"("createdAt");

-- CreateIndex
CREATE INDEX "Inquiry_charterWeekId_idx" ON "Inquiry"("charterWeekId");

-- CreateIndex
CREATE INDEX "Inquiry_trainingProgram_idx" ON "Inquiry"("trainingProgram");

-- CreateIndex
CREATE INDEX "CharterAvailability_startDate_idx" ON "CharterAvailability"("startDate");

-- CreateIndex
CREATE INDEX "CharterAvailability_endDate_idx" ON "CharterAvailability"("endDate");

-- CreateIndex
CREATE INDEX "CharterAvailability_status_idx" ON "CharterAvailability"("status");

-- CreateIndex
CREATE INDEX "CharterAvailability_weekLabel_idx" ON "CharterAvailability"("weekLabel");

-- CreateIndex
CREATE INDEX "CharterAvailability_boatId_idx" ON "CharterAvailability"("boatId");
