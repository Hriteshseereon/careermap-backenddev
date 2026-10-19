/*
  Warnings:

  - You are about to drop the column `institutionId` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `institutionId` on the `Secondcategory` table. All the data in the column will be lost.
  - You are about to drop the column `institutionId` on the `Subcategory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Category" DROP CONSTRAINT "Category_institutionId_fkey";

-- DropForeignKey
ALTER TABLE "Secondcategory" DROP CONSTRAINT "Secondcategory_institutionId_fkey";

-- DropForeignKey
ALTER TABLE "Subcategory" DROP CONSTRAINT "Subcategory_institutionId_fkey";

-- AlterTable
ALTER TABLE "Category" DROP COLUMN "institutionId";

-- AlterTable
ALTER TABLE "Institutions" ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "secondcategoryId" INTEGER,
ADD COLUMN     "subcategoryId" INTEGER;

-- AlterTable
ALTER TABLE "Scholarship" ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "secondcategoryId" INTEGER,
ADD COLUMN     "subcategoryId" INTEGER;

-- AlterTable
ALTER TABLE "Secondcategory" DROP COLUMN "institutionId";

-- AlterTable
ALTER TABLE "Subcategory" DROP COLUMN "institutionId";

-- AddForeignKey
ALTER TABLE "Institutions" ADD CONSTRAINT "Institutions_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Institutions" ADD CONSTRAINT "Institutions_secondcategoryId_fkey" FOREIGN KEY ("secondcategoryId") REFERENCES "Secondcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Institutions" ADD CONSTRAINT "Institutions_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scholarship" ADD CONSTRAINT "Scholarship_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scholarship" ADD CONSTRAINT "Scholarship_secondcategoryId_fkey" FOREIGN KEY ("secondcategoryId") REFERENCES "Secondcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Scholarship" ADD CONSTRAINT "Scholarship_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
