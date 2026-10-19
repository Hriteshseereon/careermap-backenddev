-- DropForeignKey
ALTER TABLE "Mentor" DROP CONSTRAINT "Mentor_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Mentor" DROP CONSTRAINT "Mentor_subCategoryId_fkey";

-- AlterTable
ALTER TABLE "Mentor" ALTER COLUMN "categoryId" DROP NOT NULL,
ALTER COLUMN "subCategoryId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "StudyAbroadConsult" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "studyAbroadId" INTEGER NOT NULL,
    "preferredCountry" TEXT,
    "courseInterest" TEXT,
    "budgetRange" TEXT,
    "preferredIntake" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudyAbroadConsult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "StudyAbroadConsult_userId_idx" ON "StudyAbroadConsult"("userId");

-- CreateIndex
CREATE INDEX "StudyAbroadConsult_studyAbroadId_idx" ON "StudyAbroadConsult"("studyAbroadId");

-- AddForeignKey
ALTER TABLE "Mentor" ADD CONSTRAINT "Mentor_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentor" ADD CONSTRAINT "Mentor_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyAbroadConsult" ADD CONSTRAINT "StudyAbroadConsult_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudyAbroadConsult" ADD CONSTRAINT "StudyAbroadConsult_studyAbroadId_fkey" FOREIGN KEY ("studyAbroadId") REFERENCES "StudyAbroad"("id") ON DELETE CASCADE ON UPDATE CASCADE;
