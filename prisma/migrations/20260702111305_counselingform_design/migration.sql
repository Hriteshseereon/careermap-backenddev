/*
  Warnings:

  - You are about to drop the column `description` on the `CounselingForm` table. All the data in the column will be lost.
  - You are about to drop the column `firstName` on the `CounselingForm` table. All the data in the column will be lost.
  - You are about to drop the column `inquiryFor` on the `CounselingForm` table. All the data in the column will be lost.
  - You are about to drop the column `interest` on the `CounselingForm` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `CounselingForm` table. All the data in the column will be lost.
  - You are about to drop the column `study` on the `CounselingForm` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CounselingForm" DROP COLUMN "description",
DROP COLUMN "firstName",
DROP COLUMN "inquiryFor",
DROP COLUMN "interest",
DROP COLUMN "lastName",
DROP COLUMN "study",
ADD COLUMN     "category" TEXT,
ADD COLUMN     "class" TEXT,
ADD COLUMN     "counselingDate" TIMESTAMP(3),
ADD COLUMN     "counselorName" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "dreamCareerOption1" TEXT,
ADD COLUMN     "dreamCareerOption2" TEXT,
ADD COLUMN     "dreamCareerOption3" TEXT,
ADD COLUMN     "fatherOccupation" TEXT,
ADD COLUMN     "marks" JSONB,
ADD COLUMN     "motherOccupation" TEXT,
ADD COLUMN     "observation" TEXT,
ADD COLUMN     "parentsExpectation" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "psychometricRecommended" BOOLEAN,
ADD COLUMN     "school" TEXT,
ADD COLUMN     "siblingCount" INTEGER,
ADD COLUMN     "stream" TEXT,
ADD COLUMN     "studentName" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
