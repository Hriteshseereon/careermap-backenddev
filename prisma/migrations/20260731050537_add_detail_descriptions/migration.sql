-- CreateTable
CREATE TABLE "DetailDescription" (
    "id" SERIAL NOT NULL,
    "detailsId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DetailDescription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "DetailDescription_detailsId_idx" ON "DetailDescription"("detailsId");

-- AddForeignKey
ALTER TABLE "DetailDescription" ADD CONSTRAINT "DetailDescription_detailsId_fkey" FOREIGN KEY ("detailsId") REFERENCES "Details"("id") ON DELETE CASCADE ON UPDATE CASCADE;
