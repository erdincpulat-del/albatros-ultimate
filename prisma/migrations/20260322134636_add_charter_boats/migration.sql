-- CreateTable
CREATE TABLE "CharterBoat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "cabins" INTEGER NOT NULL,
    "guestsLabel" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "shortNote" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "features" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "CharterBoatPrice" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "month" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "boatId" TEXT NOT NULL,
    CONSTRAINT "CharterBoatPrice_boatId_fkey" FOREIGN KEY ("boatId") REFERENCES "CharterBoat" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "CharterBoat_slug_key" ON "CharterBoat"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "CharterBoatPrice_boatId_month_key" ON "CharterBoatPrice"("boatId", "month");
