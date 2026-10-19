-- CreateTable
CREATE TABLE "Plans" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "features" TEXT,
    "description" TEXT,
    "validity" TEXT,
    "price" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Plans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ModuleToPlans" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ModuleToPlans_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Plans_name_key" ON "Plans"("name");

-- CreateIndex
CREATE INDEX "_ModuleToPlans_B_index" ON "_ModuleToPlans"("B");

-- AddForeignKey
ALTER TABLE "_ModuleToPlans" ADD CONSTRAINT "_ModuleToPlans_A_fkey" FOREIGN KEY ("A") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ModuleToPlans" ADD CONSTRAINT "_ModuleToPlans_B_fkey" FOREIGN KEY ("B") REFERENCES "Plans"("id") ON DELETE CASCADE ON UPDATE CASCADE;
