-- DropForeignKey
ALTER TABLE "SalaryRange" DROP CONSTRAINT "SalaryRange_detailsId_fkey";

-- AddForeignKey
ALTER TABLE "SalaryRange" ADD CONSTRAINT "SalaryRange_detailsId_fkey" FOREIGN KEY ("detailsId") REFERENCES "Details"("id") ON DELETE CASCADE ON UPDATE CASCADE;
