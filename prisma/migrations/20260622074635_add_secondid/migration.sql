-- AlterTable
ALTER TABLE "Mentor" ADD COLUMN     "secondcategoryId" INTEGER;

-- AddForeignKey
ALTER TABLE "Mentor" ADD CONSTRAINT "Mentor_secondcategoryId_fkey" FOREIGN KEY ("secondcategoryId") REFERENCES "Secondcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
