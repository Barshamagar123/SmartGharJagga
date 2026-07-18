/*
  Warnings:

  - The values [AGENT] on the enum `MatchType` will be removed. If these variants are still used in the database, this will fail.
  - The values [PROFESSIONAL,AGENCY] on the enum `SubscriptionPlan` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `agentId` on the `matches` table. All the data in the column will be lost.
  - The `status` column on the `subscriptions` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "MatchType_new" AS ENUM ('PROPERTY');
ALTER TABLE "matches" ALTER COLUMN "matchType" TYPE "MatchType_new" USING ("matchType"::text::"MatchType_new");
ALTER TYPE "MatchType" RENAME TO "MatchType_old";
ALTER TYPE "MatchType_new" RENAME TO "MatchType";
DROP TYPE "public"."MatchType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionPlan_new" AS ENUM ('FREE', 'PREMIUM');
ALTER TABLE "subscriptions" ALTER COLUMN "planType" TYPE "SubscriptionPlan_new" USING ("planType"::text::"SubscriptionPlan_new");
ALTER TYPE "SubscriptionPlan" RENAME TO "SubscriptionPlan_old";
ALTER TYPE "SubscriptionPlan_new" RENAME TO "SubscriptionPlan";
DROP TYPE "public"."SubscriptionPlan_old";
COMMIT;

-- DropIndex
DROP INDEX "matches_agentId_idx";

-- AlterTable
ALTER TABLE "matches" DROP COLUMN "agentId";

-- AlterTable
ALTER TABLE "subscriptions" DROP COLUMN "status",
ADD COLUMN     "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE';

-- CreateIndex
CREATE INDEX "subscriptions_status_idx" ON "subscriptions"("status");
