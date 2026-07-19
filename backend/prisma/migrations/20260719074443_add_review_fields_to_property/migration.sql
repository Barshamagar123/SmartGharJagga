-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "averageRating" DOUBLE PRECISION DEFAULT 0,
ADD COLUMN     "totalReviews" INTEGER NOT NULL DEFAULT 0;
