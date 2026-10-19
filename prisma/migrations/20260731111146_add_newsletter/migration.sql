-- CreateTable
CREATE TABLE "Careernewsletter" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Careernewsletter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Careernewsletter_title_key" ON "Careernewsletter"("title");
