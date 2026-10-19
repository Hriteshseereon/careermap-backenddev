/*
  Warnings:

  - You are about to drop the column `careerpathId` on the `Details` table. All the data in the column will be lost.
  - You are about to drop the column `entranceexamId` on the `Details` table. All the data in the column will be lost.
  - You are about to drop the column `institutionId` on the `Details` table. All the data in the column will be lost.
  - You are about to drop the `subcategory` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[pathName]` on the table `CareerPath` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[examname]` on the table `EntranceExam` will be added. If there are existing duplicate values, this will fail.
  - Made the column `examname` on table `EntranceExam` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "CareerPath" DROP CONSTRAINT "CareerPath_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CareerPath" DROP CONSTRAINT "CareerPath_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "CareerPath" DROP CONSTRAINT "CareerPath_pathId_fkey";

-- DropForeignKey
ALTER TABLE "CareerPath" DROP CONSTRAINT "CareerPath_secondcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "CareerPath" DROP CONSTRAINT "CareerPath_subcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Details" DROP CONSTRAINT "Details_careerpathId_fkey";

-- DropForeignKey
ALTER TABLE "Details" DROP CONSTRAINT "Details_entranceexamId_fkey";

-- DropForeignKey
ALTER TABLE "Details" DROP CONSTRAINT "Details_institutionId_fkey";

-- DropForeignKey
ALTER TABLE "Details" DROP CONSTRAINT "Details_subcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "EntranceExam" DROP CONSTRAINT "EntranceExam_moduleId_fkey";

-- DropForeignKey
ALTER TABLE "EntranceExam" DROP CONSTRAINT "EntranceExam_subcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Mentor" DROP CONSTRAINT "Mentor_subCategoryId_fkey";

-- DropForeignKey
ALTER TABLE "subcategory" DROP CONSTRAINT "subcategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "subcategory" DROP CONSTRAINT "subcategory_institutionId_fkey";

-- DropForeignKey
ALTER TABLE "subcategory" DROP CONSTRAINT "subcategory_secondcategoryId_fkey";

-- AlterTable
ALTER TABLE "CareerPath" ADD COLUMN     "pathName" TEXT,
ALTER COLUMN "moduleId" DROP NOT NULL,
ALTER COLUMN "categoryId" DROP NOT NULL,
ALTER COLUMN "secondcategoryId" DROP NOT NULL,
ALTER COLUMN "subcategoryId" DROP NOT NULL,
ALTER COLUMN "pathId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Details" DROP COLUMN "careerpathId",
DROP COLUMN "entranceexamId",
DROP COLUMN "institutionId";

-- AlterTable
ALTER TABLE "EntranceExam" ALTER COLUMN "moduleId" DROP NOT NULL,
ALTER COLUMN "examname" SET NOT NULL;

-- DropTable
DROP TABLE "subcategory";

-- CreateTable
CREATE TABLE "Subcategory" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "secondcategoryId" INTEGER NOT NULL,
    "institutionId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "path" TEXT,
    "file" TEXT,
    "coverImage" TEXT,
    "description" TEXT,
    "specialization" TEXT,
    "importandt_facts" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subcategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_DetailsToEntranceExam" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DetailsToEntranceExam_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_DetailsToInstitutions" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DetailsToInstitutions_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_CareerPathToDetails" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_CareerPathToDetails_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DetailsToEntranceExam_B_index" ON "_DetailsToEntranceExam"("B");

-- CreateIndex
CREATE INDEX "_DetailsToInstitutions_B_index" ON "_DetailsToInstitutions"("B");

-- CreateIndex
CREATE INDEX "_CareerPathToDetails_B_index" ON "_CareerPathToDetails"("B");

-- CreateIndex
CREATE UNIQUE INDEX "CareerPath_pathName_key" ON "CareerPath"("pathName");

-- CreateIndex
CREATE INDEX "Details_streamId_idx" ON "Details"("streamId");

-- CreateIndex
CREATE INDEX "Details_categoryId_idx" ON "Details"("categoryId");

-- CreateIndex
CREATE INDEX "Details_secondcategoryId_idx" ON "Details"("secondcategoryId");

-- CreateIndex
CREATE INDEX "Details_subcategoryId_idx" ON "Details"("subcategoryId");

-- CreateIndex
CREATE UNIQUE INDEX "EntranceExam_examname_key" ON "EntranceExam"("examname");

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_secondcategoryId_fkey" FOREIGN KEY ("secondcategoryId") REFERENCES "Secondcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subcategory" ADD CONSTRAINT "Subcategory_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPath" ADD CONSTRAINT "CareerPath_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPath" ADD CONSTRAINT "CareerPath_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPath" ADD CONSTRAINT "CareerPath_secondcategoryId_fkey" FOREIGN KEY ("secondcategoryId") REFERENCES "Secondcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPath" ADD CONSTRAINT "CareerPath_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPath" ADD CONSTRAINT "CareerPath_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "PathType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntranceExam" ADD CONSTRAINT "EntranceExam_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntranceExam" ADD CONSTRAINT "EntranceExam_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "Subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentor" ADD CONSTRAINT "Mentor_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "Subcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DetailsToEntranceExam" ADD CONSTRAINT "_DetailsToEntranceExam_A_fkey" FOREIGN KEY ("A") REFERENCES "Details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DetailsToEntranceExam" ADD CONSTRAINT "_DetailsToEntranceExam_B_fkey" FOREIGN KEY ("B") REFERENCES "EntranceExam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DetailsToInstitutions" ADD CONSTRAINT "_DetailsToInstitutions_A_fkey" FOREIGN KEY ("A") REFERENCES "Details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DetailsToInstitutions" ADD CONSTRAINT "_DetailsToInstitutions_B_fkey" FOREIGN KEY ("B") REFERENCES "Institutions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CareerPathToDetails" ADD CONSTRAINT "_CareerPathToDetails_A_fkey" FOREIGN KEY ("A") REFERENCES "CareerPath"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CareerPathToDetails" ADD CONSTRAINT "_CareerPathToDetails_B_fkey" FOREIGN KEY ("B") REFERENCES "Details"("id") ON DELETE CASCADE ON UPDATE CASCADE;
