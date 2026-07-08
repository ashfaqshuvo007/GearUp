/*
  Warnings:

  - Added the required column `providerId` to the `GearItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "GearItem" ADD COLUMN     "providerId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "GearItem" ADD CONSTRAINT "GearItem_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
