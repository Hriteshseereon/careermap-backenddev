-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "freePreview" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ModuleAccess" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "freeVisitUsed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModuleAccess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ModuleAccess_userId_moduleId_key" ON "ModuleAccess"("userId", "moduleId");

-- AddForeignKey
ALTER TABLE "ModuleAccess" ADD CONSTRAINT "ModuleAccess_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ModuleAccess" ADD CONSTRAINT "ModuleAccess_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
