/*
  Warnings:

  - Added the required column `planId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `amount` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `planId` to the `Subscriptions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "planId" INTEGER NOT NULL,
ADD COLUMN     "stripeId" TEXT;

-- AlterTable
ALTER TABLE "Subscriptions" ADD COLUMN     "amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "planId" INTEGER NOT NULL,
ADD COLUMN     "stripeSessionId" TEXT,
ALTER COLUMN "planType" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plans"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
