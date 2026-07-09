/*
  Warnings:

  - The values [PENDING,CANCELLED] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - The primary key for the `Payment` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[transactionId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Payment` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('PENDING_PAYMENT', 'CONFIRMED', 'PICKEDUP', 'RETURNED', 'CANCELED');
ALTER TABLE "public"."RentalOrder" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "RentalOrder" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "public"."OrderStatus_old";
ALTER TABLE "RentalOrder" ALTER COLUMN "status" SET DEFAULT 'PENDING_PAYMENT';
COMMIT;

-- AlterTable
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "transactionId" DROP NOT NULL,
ADD CONSTRAINT "Payment_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RentalOrder" ALTER COLUMN "status" SET DEFAULT 'PENDING_PAYMENT';

-- CreateIndex
CREATE UNIQUE INDEX "Payment_transactionId_key" ON "Payment"("transactionId");
