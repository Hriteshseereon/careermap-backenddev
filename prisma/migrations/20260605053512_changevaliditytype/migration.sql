/*
  Warnings:

  - The `validity` column on the `Plans` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Plans" DROP COLUMN "validity",
ADD COLUMN     "validity" INTEGER;
