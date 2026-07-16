-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "videos" TEXT[] DEFAULT ARRAY[]::TEXT[];
