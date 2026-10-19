-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "streamId" INTEGER NOT NULL,
    "institutionId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "path" TEXT,
    "file" TEXT,
    "coverImage" TEXT,
    "description" TEXT,
    "specialization" TEXT,
    "importandt_facts" TEXT[],
    "category_access" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Secondcategory" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT,
    "image" TEXT,
    "coverImage" TEXT,
    "description" TEXT,
    "specialization" TEXT,
    "importandt_facts" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Secondcategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subcategory" (
    "id" SERIAL NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "secondcategoryId" INTEGER NOT NULL,
    "institutionId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "path" TEXT,
    "file" TEXT,
    "coverImage" TEXT,
    "description" TEXT,
    "specialization" TEXT,
    "importandt_facts" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subcategory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Secondcategory" ADD CONSTRAINT "Secondcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcategory" ADD CONSTRAINT "subcategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcategory" ADD CONSTRAINT "subcategory_secondcategoryId_fkey" FOREIGN KEY ("secondcategoryId") REFERENCES "Secondcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subcategory" ADD CONSTRAINT "subcategory_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institutions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
