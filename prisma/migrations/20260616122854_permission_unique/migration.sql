/*
  Warnings:

  - A unique constraint covering the columns `[roleId,module]` on the table `Permission` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Permission" ALTER COLUMN "canView" SET DEFAULT true,
ALTER COLUMN "canCreate" SET DEFAULT true,
ALTER COLUMN "canEdit" SET DEFAULT true,
ALTER COLUMN "canDelete" SET DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Permission_roleId_module_key" ON "Permission"("roleId", "module");
