-- CreateTable
CREATE TABLE "Institutions" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "logo" TEXT,
    "address" TEXT,
    "admission_process" TEXT,
    "tentative_date" TEXT,
    "institute_type" TEXT,
    "url" TEXT,
    "countruy" TEXT,
    "state" TEXT,
    "city" TEXT,
    "district" TEXT,
    "is_top" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institutions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Institutions_name_key" ON "Institutions"("name");
