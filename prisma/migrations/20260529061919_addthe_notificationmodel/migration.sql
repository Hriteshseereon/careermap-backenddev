-- AlterTable
ALTER TABLE "Plans" ADD COLUMN     "plan_type" TEXT;

-- CreateTable
CREATE TABLE "Notification" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT,
    "target" TEXT,
    "status" TEXT DEFAULT 'pending',
    "type" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);
