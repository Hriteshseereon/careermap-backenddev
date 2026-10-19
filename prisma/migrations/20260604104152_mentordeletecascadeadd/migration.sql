-- DropForeignKey
ALTER TABLE "MentorAvailability" DROP CONSTRAINT "MentorAvailability_mentorId_fkey";

-- DropForeignKey
ALTER TABLE "Mentorbooking" DROP CONSTRAINT "Mentorbooking_mentorId_fkey";

-- AddForeignKey
ALTER TABLE "MentorAvailability" ADD CONSTRAINT "MentorAvailability_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentorbooking" ADD CONSTRAINT "Mentorbooking_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Mentor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
