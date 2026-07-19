/*
  Warnings:

  - A unique constraint covering the columns `[propertyId,reviewerId]` on the table `reviews` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `propertyId` to the `reviews` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_reviewerId_fkey";

-- AlterTable
ALTER TABLE "reviews" ADD COLUMN     "isApproved" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "propertyId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "reviews_propertyId_idx" ON "reviews"("propertyId");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_propertyId_reviewerId_key" ON "reviews"("propertyId", "reviewerId");

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
