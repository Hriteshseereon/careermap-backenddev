-- CreateTable
CREATE TABLE "InstitutionImport" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "totalRows" INTEGER NOT NULL DEFAULT 0,
    "processed" INTEGER NOT NULL DEFAULT 0,
    "successful" INTEGER NOT NULL DEFAULT 0,
    "failed" INTEGER NOT NULL DEFAULT 0,
    "skipped" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "errorFile" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstitutionImport_pkey" PRIMARY KEY ("id")
);
