-- AlterTable
ALTER TABLE "Mentorbooking" ADD COLUMN     "reviewSubmitted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "MentorReview" (
    "id" SERIAL NOT NULL,
    "mentorId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "bookingId" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "review" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MentorReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MentorReview_bookingId_key" ON "MentorReview"("bookingId");

-- CreateIndex
CREATE INDEX "MentorReview_mentorId_idx" ON "MentorReview"("mentorId");

-- AddForeignKey
ALTER TABLE "MentorReview" ADD CONSTRAINT "MentorReview_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorReview" ADD CONSTRAINT "MentorReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MentorReview" ADD CONSTRAINT "MentorReview_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Mentorbooking"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
