/*
  Warnings:

  - The values [RENTED] on the enum `PropertyStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [APARTMENT,BUNGALOW,VILLA] on the enum `PropertyType` will be removed. If these variants are still used in the database, this will fail.
  - The values [RENT] on the enum `Purpose` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `agentId` on the `commissions` table. All the data in the column will be lost.
  - You are about to drop the column `agentId` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `agentId` on the `reviews` table. All the data in the column will be lost.
  - You are about to drop the `agents` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PropertyStatus_new" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SOLD');
ALTER TABLE "public"."properties" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "properties" ALTER COLUMN "status" TYPE "PropertyStatus_new" USING ("status"::text::"PropertyStatus_new");
ALTER TYPE "PropertyStatus" RENAME TO "PropertyStatus_old";
ALTER TYPE "PropertyStatus_new" RENAME TO "PropertyStatus";
DROP TYPE "public"."PropertyStatus_old";
ALTER TABLE "properties" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "PropertyType_new" AS ENUM ('HOUSE', 'RESIDENTIAL_LAND', 'COMMERCIAL_LAND', 'AGRICULTURAL_LAND', 'INDUSTRIAL_LAND', 'SHOP', 'OFFICE', 'WAREHOUSE', 'HOTEL', 'RESTAURANT');
ALTER TABLE "user_preferences" ALTER COLUMN "propertyType" TYPE "PropertyType_new" USING ("propertyType"::text::"PropertyType_new");
ALTER TABLE "properties" ALTER COLUMN "propertyType" TYPE "PropertyType_new" USING ("propertyType"::text::"PropertyType_new");
ALTER TYPE "PropertyType" RENAME TO "PropertyType_old";
ALTER TYPE "PropertyType_new" RENAME TO "PropertyType";
DROP TYPE "public"."PropertyType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "Purpose_new" AS ENUM ('SALE');
ALTER TABLE "user_preferences" ALTER COLUMN "purpose" TYPE "Purpose_new" USING ("purpose"::text::"Purpose_new");
ALTER TABLE "properties" ALTER COLUMN "purpose" TYPE "Purpose_new" USING ("purpose"::text::"Purpose_new");
ALTER TYPE "Purpose" RENAME TO "Purpose_old";
ALTER TYPE "Purpose_new" RENAME TO "Purpose";
DROP TYPE "public"."Purpose_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "agents" DROP CONSTRAINT "agents_userId_fkey";

-- DropForeignKey
ALTER TABLE "analytics" DROP CONSTRAINT "analytics_agentId_fkey";

-- DropForeignKey
ALTER TABLE "commissions" DROP CONSTRAINT "commissions_agentId_fkey";

-- DropForeignKey
ALTER TABLE "matches" DROP CONSTRAINT "matches_agentId_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_agentId_fkey";

-- DropForeignKey
ALTER TABLE "reviews" DROP CONSTRAINT "reviews_agentId_fkey";

-- DropIndex
DROP INDEX "commissions_agentId_idx";

-- DropIndex
DROP INDEX "reviews_agentId_idx";

-- AlterTable
ALTER TABLE "commissions" DROP COLUMN "agentId";

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "agentId";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "agentId";

-- DropTable
DROP TABLE "agents";
