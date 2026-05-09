-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "program" TEXT NOT NULL,
    "startDate" DATETIME,
    "endDate" DATETIME,
    "note" TEXT,
    "paymentCode" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "certificateId" TEXT,
    "certificateLevel" TEXT,
    "certifiedAt" DATETIME,
    "cardFrontUrl" TEXT,
    "cardBackUrl" TEXT
);
INSERT INTO "new_Reservation" ("cardBackUrl", "cardFrontUrl", "certificateId", "certificateLevel", "certifiedAt", "createdAt", "email", "endDate", "fullName", "id", "note", "paymentCode", "phone", "program", "startDate", "status", "updatedAt") SELECT "cardBackUrl", "cardFrontUrl", "certificateId", "certificateLevel", "certifiedAt", "createdAt", "email", "endDate", "fullName", "id", "note", "paymentCode", "phone", "program", "startDate", "status", "updatedAt" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
CREATE UNIQUE INDEX "Reservation_certificateId_key" ON "Reservation"("certificateId");
CREATE INDEX "Reservation_status_idx" ON "Reservation"("status");
CREATE INDEX "Reservation_certificateId_idx" ON "Reservation"("certificateId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
