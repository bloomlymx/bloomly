/*
  Warnings:

  - You are about to drop the column `arrivalDate` on the `FlowerBatch` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "FlowerBatch" DROP COLUMN "arrivalDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "originalQty" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "purchaseDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "purchasePrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "expiryDate" DROP NOT NULL;
