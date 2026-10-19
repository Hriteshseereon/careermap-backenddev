-- DropForeignKey
ALTER TABLE "Details" DROP CONSTRAINT "Details_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "Details" DROP CONSTRAINT "Details_secondcategoryId_fkey";

-- DropForeignKey
ALTER TABLE "Details" DROP CONSTRAINT "Details_streamId_fkey";

-- DropForeignKey
ALTER TABLE "Details" DROP CONSTRAINT "Details_subcategoryId_fkey";

-- AlterTable
ALTER TABLE "Details" ALTER COLUMN "streamId" DROP NOT NULL,
ALTER COLUMN "categoryId" DROP NOT NULL,
ALTER COLUMN "secondcategoryId" DROP NOT NULL,
ALTER COLUMN "subcategoryId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_secondcategoryId_fkey" FOREIGN KEY ("secondcategoryId") REFERENCES "Secondcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "subcategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
