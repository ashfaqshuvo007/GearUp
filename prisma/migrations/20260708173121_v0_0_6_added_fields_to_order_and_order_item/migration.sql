/*
  Warnings:

  - Added the required column `orderQty` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `RentalOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OrderItem" ADD COLUMN     "orderQty" INTEGER NOT NULL,
ADD COLUMN     "unitPrice" DECIMAL(8,2) NOT NULL;

-- AlterTable
ALTER TABLE "RentalOrder" ADD COLUMN     "total" DECIMAL(8,2) NOT NULL;
