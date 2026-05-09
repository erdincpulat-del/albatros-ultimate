/*
  Warnings:

  - Added the required column `monthLabel` to the `CharterAvailability` table without a default value. This is not possible if the table is not empty.
  - Made the column `boatId` on table `CharterAvailability` required. This step will fail if there are existing NULL values in that column.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_CharterAvailability" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "boatId" TEXT NOT NULL,
    "weekLabel" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "monthLabel" TEXT NOT NULL,
    "routeLabel" TEXT,
    "notes" TEXT,
    "overridePrice" TEXT,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "CharterAvailability_boatId_fkey" FOREIGN KEY ("boatId") REFERENCES "CharterBoat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_CharterAvailability" ("boatId", "createdAt", "endDate", "id", "notes", "routeLabel", "startDate", "status", "updatedAt", "weekLabel") SELECT "boatId", "createdAt", "endDate", "id", "notes", "routeLabel", "startDate", "status", "updatedAt", "weekLabel" FROM "CharterAvailability";
DROP TABLE "CharterAvailability";
ALTER TABLE "new_CharterAvailability" RENAME TO "CharterAvailability";
CREATE INDEX "CharterAvailability_boatId_idx" ON "CharterAvailability"("boatId");
CREATE INDEX "CharterAvailability_startDate_idx" ON "CharterAvailability"("startDate");
CREATE INDEX "CharterAvailability_endDate_idx" ON "CharterAvailability"("endDate");
CREATE INDEX "CharterAvailability_status_idx" ON "CharterAvailability"("status");
CREATE UNIQUE INDEX "CharterAvailability_boatId_startDate_key" ON "CharterAvailability"("boatId", "startDate");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
