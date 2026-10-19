-- AlterTable
ALTER TABLE "Secondcategory" ADD COLUMN     "institutionId" INTEGER,
ALTER COLUMN "importandt_facts" DROP NOT NULL,
ALTER COLUMN "importandt_facts" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Secondcategory" ADD CONSTRAINT "Secondcategory_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
