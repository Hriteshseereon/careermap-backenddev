-- AlterTable
ALTER TABLE "Details" ADD COLUMN     "important_factor" TEXT,
ADD COLUMN     "media" TEXT,
ADD COLUMN     "specialization" TEXT;

-- AlterTable
ALTER TABLE "SalaryRange" ADD COLUMN     "profession" TEXT;
