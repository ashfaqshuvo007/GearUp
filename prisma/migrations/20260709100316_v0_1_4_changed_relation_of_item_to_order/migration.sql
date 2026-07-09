/*
  Warnings:

  - You are about to drop the column `rentalOrderId` on the `GearItem` table. All the data in the column will be lost.
  - Added the required column `orderItemId` to the `RentalOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GearItem" DROP CONSTRAINT "GearItem_rentalOrderId_fkey";

-- AlterTable
ALTER TABLE "GearItem" DROP COLUMN "rentalOrderId";

-- AlterTable
ALTER TABLE "RentalOrder" ADD COLUMN     "orderItemId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "RentalOrder" ADD CONSTRAINT "RentalOrder_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "GearItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
