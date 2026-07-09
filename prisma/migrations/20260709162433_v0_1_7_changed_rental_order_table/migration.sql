/*
  Warnings:

  - Added the required column `providerId` to the `RentalOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `RentalOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "RentalOrder" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "providerId" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AddForeignKey
ALTER TABLE "RentalOrder" ADD CONSTRAINT "RentalOrder_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
