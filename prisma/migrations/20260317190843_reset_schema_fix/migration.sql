/*
  Warnings:

  - You are about to drop the column `qualification` on the `Certificate` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Certificate` table without a default value. This is not possible if the table is not empty.
  - Added the required column `certificateId` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fullName` to the `Reservation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Certificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "certificateId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "program" TEXT,
    "qualificationLevel" TEXT,
    "issueDate" DATETIME,
    "seaMiles" INTEGER,
    "photoUrl" TEXT,
    "cardFrontUrl" TEXT,
    "cardBackUrl" TEXT,
    "verificationHash" TEXT,
    "status" TEXT DEFAULT 'PENDING',
    "instructorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Certificate_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Certificate" ("certificateId", "createdAt", "fullName", "id", "instructorId", "issueDate") SELECT "certificateId", "createdAt", "fullName", "id", "instructorId", "issueDate" FROM "Certificate";
DROP TABLE "Certificate";
ALTER TABLE "new_Certificate" RENAME TO "Certificate";
CREATE UNIQUE INDEX "Certificate_certificateId_key" ON "Certificate"("certificateId");
CREATE INDEX "Certificate_certificateId_idx" ON "Certificate"("certificateId");
CREATE INDEX "Certificate_createdAt_idx" ON "Certificate"("createdAt");
CREATE INDEX "Certificate_instructorId_idx" ON "Certificate"("instructorId");
CREATE TABLE "new_Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "certificateId" TEXT NOT NULL,
    "program" TEXT,
    "qualificationLevel" TEXT,
    "issueDate" DATETIME,
    "seaMiles" INTEGER,
    "photoUrl" TEXT,
    "cardFrontUrl" TEXT,
    "cardBackUrl" TEXT,
    "qrCodeUrl" TEXT,
    "verificationHash" TEXT,
    "status" TEXT DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Reservation" ("createdAt", "id") SELECT "createdAt", "id" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
CREATE UNIQUE INDEX "Reservation_certificateId_key" ON "Reservation"("certificateId");
CREATE INDEX "Reservation_certificateId_idx" ON "Reservation"("certificateId");
CREATE INDEX "Reservation_createdAt_idx" ON "Reservation"("createdAt");
CREATE INDEX "Reservation_status_idx" ON "Reservation"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Instructor_createdAt_idx" ON "Instructor"("createdAt");
