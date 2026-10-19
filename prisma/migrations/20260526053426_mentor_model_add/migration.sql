/*
  Warnings:

  - You are about to drop the column `available_date` on the `Mentor` table. All the data in the column will be lost.
  - You are about to drop the column `available_time` on the `Mentor` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('pending', 'confirmed', 'cancelled');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('pending', 'paid', 'failed');

-- AlterTable
ALTER TABLE "Mentor" DROP COLUMN "available_date",
DROP COLUMN "available_time";

-- CreateTable
CREATE TABLE "MentorAvailability" (
    "id" SERIAL NOT NULL,
    "mentorId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "timeSlots" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorAvailability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mentorbooking" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "mentorId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "timeSlot" TEXT NOT NULL,
    "status" "BookingStatus" NOT NULL DEFAULT 'pending',
    "paymentStatus" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "amount" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mentorbooking_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mentorpayment" (
    "id" SERIAL NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "paymentId" TEXT,
    "orderId" TEXT,
    "status" "PaymentStatus" NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Mentorpayment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Mentorbooking_mentorId_date_timeSlot_key" ON "Mentorbooking"("mentorId", "date", "timeSlot");

-- CreateIndex
CREATE UNIQUE INDEX "Mentorpayment_bookingId_key" ON "Mentorpayment"("bookingId");

-- AddForeignKey
ALTER TABLE "MentorAvailability" ADD CONSTRAINT "MentorAvailability_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentorbooking" ADD CONSTRAINT "Mentorbooking_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentorbooking" ADD CONSTRAINT "Mentorbooking_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentorpayment" ADD CONSTRAINT "Mentorpayment_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Mentorbooking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentorpayment" ADD CONSTRAINT "Mentorpayment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
