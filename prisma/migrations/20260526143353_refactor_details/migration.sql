-- DropForeignKey
ALTER TABLE "EntranceExam" DROP CONSTRAINT "EntranceExam_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "EntranceExam" DROP CONSTRAINT "EntranceExam_secondcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "EntranceExam" DROP CONSTRAINT "EntranceExam_streamId_fkey";

-- DropForeignKey
ALTER TABLE "EntranceExam" DROP CONSTRAINT "EntranceExam_subcategoryId_fkey";

-- AlterTable
ALTER TABLE "EntranceExam" ALTER COLUMN "streamId" DROP NOT NULL,
ALTER COLUMN "categoryId" DROP NOT NULL,
ALTER COLUMN "secondcategoryId" DROP NOT NULL,
ALTER COLUMN "subcategoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "EntranceExam" ADD CONSTRAINT "EntranceExam_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntranceExam" ADD CONSTRAINT "EntranceExam_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntranceExam" ADD CONSTRAINT "EntranceExam_secondcategoryId_fkey" FOREIGN KEY ("secondcategoryId") REFERENCES "Secondcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntranceExam" ADD CONSTRAINT "EntranceExam_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
