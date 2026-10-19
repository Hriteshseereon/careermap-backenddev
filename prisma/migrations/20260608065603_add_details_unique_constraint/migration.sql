/*
  Warnings:

  - A unique constraint covering the columns `[streamId,categoryId,secondcategoryId,subcategoryId]` on the table `Details` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Details_streamId_categoryId_secondcategoryId_subcategoryId_key" ON "Details"("streamId", "categoryId", "secondcategoryId", "subcategoryId");
