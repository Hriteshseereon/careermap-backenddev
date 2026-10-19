-- AlterTable
ALTER TABLE "subcategory" ALTER COLUMN "importandt_facts" DROP NOT NULL,
ALTER COLUMN "importandt_facts" SET DATA TYPE TEXT;
