-- AlterTable
ALTER TABLE "Mentor" ADD COLUMN     "year" TEXT;

-- CreateTable
CREATE TABLE "CounselingForm" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "email" TEXT,
    "inquiryFor" TEXT,
    "interest" TEXT,
    "study" TEXT,
    "description" TEXT,

    CONSTRAINT "CounselingForm_pkey" PRIMARY KEY ("id")
);
