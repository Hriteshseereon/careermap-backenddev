-- CreateTable
CREATE TABLE "ScholarshipSection" (
    "id" SERIAL NOT NULL,
    "scholarshipId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScholarshipSection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ScholarshipSection" ADD CONSTRAINT "ScholarshipSection_scholarshipId_fkey" FOREIGN KEY ("scholarshipId") REFERENCES "Scholarship"("id") ON DELETE CASCADE ON UPDATE CASCADE;
