-- CreateEnum
CREATE TYPE "AreaUnit" AS ENUM ('DHUR', 'AANA', 'ROPANI', 'BISWA', 'KATHA', 'SQFT', 'SQUARE_FEET', 'SQUARE_METER', 'HECTARE');

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "areaUnit" "AreaUnit";
