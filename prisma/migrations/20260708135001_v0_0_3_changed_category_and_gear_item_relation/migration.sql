/*
  Warnings:

  - You are about to drop the column `categoryId` on the `GearItem` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[categoryName]` on the table `GearItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `categoryName` to the `GearItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "GearItem" DROP CONSTRAINT "GearItem_categoryId_fkey";

-- DropIndex
DROP INDEX "GearItem_categoryId_key";

-- AlterTable
ALTER TABLE "GearItem" DROP COLUMN "categoryId",
ADD COLUMN     "categoryName" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "GearItem_categoryName_key" ON "GearItem"("categoryName");

-- AddForeignKey
ALTER TABLE "GearItem" ADD CONSTRAINT "GearItem_categoryName_fkey" FOREIGN KEY ("categoryName") REFERENCES "Category"("name") ON DELETE RESTRICT ON UPDATE CASCADE;
