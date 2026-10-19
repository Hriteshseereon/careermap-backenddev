-- AlterTable
ALTER TABLE "Details" ADD COLUMN     "careerpathId" INTEGER,
ADD COLUMN     "entranceexamId" INTEGER,
ADD COLUMN     "institutionId" INTEGER;

-- CreateTable
CREATE TABLE "Mentor" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "subCategoryId" INTEGER NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "phone_number" TEXT,
    "dateof_birth" TIMESTAMP(3),
    "designation" TEXT,
    "education" TEXT,
    "placeof_word" TEXT,
    "linkedin" TEXT,
    "facebook" TEXT,
    "skill" TEXT,
    "experience" INTEGER,
    "mentor_fees" TEXT,
    "rank" TEXT,
    "image" TEXT,
    "resume" TEXT,
    "description" TEXT,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Mentor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_careerpathId_fkey" FOREIGN KEY ("careerpathId") REFERENCES "CareerPath"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_entranceexamId_fkey" FOREIGN KEY ("entranceexamId") REFERENCES "EntranceExam"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institutions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentor" ADD CONSTRAINT "Mentor_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mentor" ADD CONSTRAINT "Mentor_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "subcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
