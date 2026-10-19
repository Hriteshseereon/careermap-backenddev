/*
  Warnings:

  - You are about to drop the `LandingPage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LandingPage" DROP CONSTRAINT "LandingPage_userId_fkey";

-- AlterTable
ALTER TABLE "Users" ALTER COLUMN "country" DROP NOT NULL,
ALTER COLUMN "state" DROP NOT NULL,
ALTER COLUMN "city" DROP NOT NULL,
ALTER COLUMN "district" DROP NOT NULL,
ALTER COLUMN "gender" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "dataOfBirth" DROP NOT NULL,
ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'active';

-- DropTable
DROP TABLE "LandingPage";

-- CreateTable
CREATE TABLE "profile" (
    "id" SERIAL NOT NULL,
    "class" TEXT NOT NULL,
    "stream" TEXT NOT NULL,
    "interest" TEXT[],
    "clarity" TEXT NOT NULL,
    "strength" TEXT[],
    "priority" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdminUsers" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "username" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminUsers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscriptions" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "planType" TEXT NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_userId_key" ON "profile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AdminUsers_email_key" ON "AdminUsers"("email");

-- AddForeignKey
ALTER TABLE "profile" ADD CONSTRAINT "profile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscriptions" ADD CONSTRAINT "Subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
