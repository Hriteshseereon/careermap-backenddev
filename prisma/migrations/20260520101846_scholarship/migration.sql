-- CreateTable
CREATE TABLE "Scholarship" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT,
    "url" TEXT,
    "is_free" BOOLEAN NOT NULL DEFAULT false,
    "price" TEXT,
    "deadline" TIMESTAMP(3),
    "image" TEXT,
    "eligibility" TEXT,
    "requirement" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Scholarship_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Scholarship_name_key" ON "Scholarship"("name");
