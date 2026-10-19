-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "instituteId" INTEGER,
ADD COLUMN     "isInstituteStudent" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "Institutes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "contract_person" TEXT,
    "mobile" TEXT,
    "address" TEXT,
    "limit" INTEGER NOT NULL DEFAULT 100,
    "student_allow" BOOLEAN NOT NULL DEFAULT true,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institutes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Institutes_name_key" ON "Institutes"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Institutes_email_key" ON "Institutes"("email");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "Institutes"("id") ON DELETE SET NULL ON UPDATE CASCADE;
