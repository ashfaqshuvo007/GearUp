/*
  Warnings:

  - Added the required column `content` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "content" TEXT NOT NULL,
ADD COLUMN     "rating" DECIMAL(2,1) NOT NULL;
