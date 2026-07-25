-- AlterTable
ALTER TABLE "payments" ADD COLUMN     "gatewayReference" TEXT;

-- CreateIndex
CREATE INDEX "payments_createdAt_idx" ON "payments"("createdAt");
