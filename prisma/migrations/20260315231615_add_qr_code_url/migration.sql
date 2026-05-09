/*
  Warnings:

  - You are about to drop the column `email` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `endDate` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `paymentCode` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `startDate` on the `Reservation` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "fullName" TEXT NOT NULL,
    "program" TEXT,
    "certificateLevel" TEXT,
    "certificateId" TEXT,
    "certifiedAt" DATETIME,
    "seaMiles" INTEGER,
    "photoUrl" TEXT,
    "cardFrontUrl" TEXT,
    "cardBackUrl" TEXT,
    "qrCodeUrl" TEXT,
    "verificationHash" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE'
);
INSERT INTO "new_Reservation" ("cardBackUrl", "cardFrontUrl", "certificateId", "certificateLevel", "certifiedAt", "createdAt", "fullName", "id", "photoUrl", "program", "status", "updatedAt") SELECT "cardBackUrl", "cardFrontUrl", "certificateId", "certificateLevel", "certifiedAt", "createdAt", "fullName", "id", "photoUrl", "program", "status", "updatedAt" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
CREATE UNIQUE INDEX "Reservation_certificateId_key" ON "Reservation"("certificateId");
CREATE UNIQUE INDEX "Reservation_verificationHash_key" ON "Reservation"("verificationHash");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
