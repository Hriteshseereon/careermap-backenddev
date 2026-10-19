-- DropForeignKey
ALTER TABLE "QuizOption" DROP CONSTRAINT "QuizOption_questionId_fkey";

-- AlterTable
ALTER TABLE "EntranceExam" ADD COLUMN     "about" TEXT,
ADD COLUMN     "duration" TEXT,
ADD COLUMN     "eligibility" TEXT,
ADD COLUMN     "exam_date" TIMESTAMP(3),
ADD COLUMN     "exam_pattern" TEXT,
ADD COLUMN     "frequncy" TEXT,
ADD COLUMN     "mode" TEXT,
ADD COLUMN     "subject" TEXT[],
ADD COLUMN     "top_institution" TEXT[],
ADD COLUMN     "total_mark" TEXT;

-- AlterTable
ALTER TABLE "Institutions" ADD COLUMN     "about" TEXT,
ADD COLUMN     "course_offered" TEXT[];

-- AlterTable
ALTER TABLE "Mentor" ADD COLUMN     "available_date" TIMESTAMP(3),
ADD COLUMN     "available_time" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "MasterClass" (
    "id" SERIAL NOT NULL,
    "category" TEXT,
    "image" TEXT,
    "title" TEXT,
    "name" TEXT,
    "time" TIMESTAMP(3),
    "views" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "video_url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MasterClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudyAbroad" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "country_name" TEXT,
    "description" TEXT,
    "overview" TEXT,
    "visa_work" TEXT,
    "living_cost" TEXT,
    "tution_cost" TEXT,
    "top_university" TEXT[],
    "scholarship" TEXT[],
    "requirment" TEXT[],
    "popular_course" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyAbroad_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuizOption" ADD CONSTRAINT "QuizOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;
