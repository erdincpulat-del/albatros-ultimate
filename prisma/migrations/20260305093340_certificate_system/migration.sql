/*
  Warnings:

  - A unique constraint covering the columns `[certificateId]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN "cardBackUrl" TEXT;
ALTER TABLE "Reservation" ADD COLUMN "cardFrontUrl" TEXT;
ALTER TABLE "Reservation" ADD COLUMN "certificateId" TEXT;
ALTER TABLE "Reservation" ADD COLUMN "certifiedAt" DATETIME;

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_certificateId_key" ON "Reservation"("certificateId");
