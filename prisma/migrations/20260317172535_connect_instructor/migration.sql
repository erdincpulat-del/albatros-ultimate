/*
  Warnings:

  - You are about to drop the column `cardBackUrl` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `cardFrontUrl` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `certificateId` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `certificateLevel` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `certifiedAt` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `fullName` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `photoUrl` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `program` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `qrCodeUrl` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `seaMiles` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Reservation` table. All the data in the column will be lost.
  - You are about to drop the column `verificationHash` on the `Reservation` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "AdminLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "action" TEXT NOT NULL,
    "targetType" TEXT,
    "targetId" TEXT,
    "details" TEXT
);

-- CreateTable
CREATE TABLE "Instructor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "fullName" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "certificateId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "qualification" TEXT,
    "issueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "instructorId" TEXT,
    CONSTRAINT "Certificate_instructorId_fkey" FOREIGN KEY ("instructorId") REFERENCES "Instructor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Reservation" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Reservation" ("createdAt", "id") SELECT "createdAt", "id" FROM "Reservation";
DROP TABLE "Reservation";
ALTER TABLE "new_Reservation" RENAME TO "Reservation";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "AdminLog_createdAt_idx" ON "AdminLog"("createdAt");

-- CreateIndex
CREATE INDEX "AdminLog_action_idx" ON "AdminLog"("action");

-- CreateIndex
CREATE INDEX "AdminLog_targetType_idx" ON "AdminLog"("targetType");

-- CreateIndex
CREATE INDEX "AdminLog_targetId_idx" ON "AdminLog"("targetId");

-- CreateIndex
CREATE UNIQUE INDEX "Certificate_certificateId_key" ON "Certificate"("certificateId");

-- CreateIndex
CREATE INDEX "Certificate_certificateId_idx" ON "Certificate"("certificateId");

-- CreateIndex
CREATE INDEX "Certificate_createdAt_idx" ON "Certificate"("createdAt");

-- CreateIndex
CREATE INDEX "Certificate_instructorId_idx" ON "Certificate"("instructorId");
