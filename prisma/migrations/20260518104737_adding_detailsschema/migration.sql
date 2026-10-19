-- CreateTable
CREATE TABLE "Details" (
    "id" SERIAL NOT NULL,
    "streamId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "secondcategoryId" INTEGER NOT NULL,
    "subcategoryId" INTEGER NOT NULL,
    "jobScope" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SalaryRange" (
    "id" SERIAL NOT NULL,
    "minSalary" DOUBLE PRECISION NOT NULL,
    "maxSalary" DOUBLE PRECISION NOT NULL,
    "detailsId" INTEGER NOT NULL,

    CONSTRAINT "SalaryRange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PathType" (
    "id" SERIAL NOT NULL,
    "pathtype" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PathType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerPath" (
    "id" SERIAL NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "secondcategoryId" INTEGER NOT NULL,
    "subcategoryId" INTEGER NOT NULL,
    "pathId" INTEGER NOT NULL,
    "graduation" TEXT,
    "aftergraduation" TEXT,
    "afterpostgraduation" TEXT,
    "anyother" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EntranceExam" (
    "id" SERIAL NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "streamId" INTEGER NOT NULL,
    "categoryId" INTEGER NOT NULL,
    "secondcategoryId" INTEGER NOT NULL,
    "subcategoryId" INTEGER NOT NULL,
    "examname" TEXT,
    "issuedate" TIMESTAMP(3),
    "lastdate" TIMESTAMP(3),
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EntranceExam_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_secondcategoryId_fkey" FOREIGN KEY ("secondcategoryId") REFERENCES "Secondcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "subcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SalaryRange" ADD CONSTRAINT "SalaryRange_detailsId_fkey" FOREIGN KEY ("detailsId") REFERENCES "Details"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPath" ADD CONSTRAINT "CareerPath_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPath" ADD CONSTRAINT "CareerPath_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPath" ADD CONSTRAINT "CareerPath_secondcategoryId_fkey" FOREIGN KEY ("secondcategoryId") REFERENCES "Secondcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPath" ADD CONSTRAINT "CareerPath_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "subcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPath" ADD CONSTRAINT "CareerPath_pathId_fkey" FOREIGN KEY ("pathId") REFERENCES "PathType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntranceExam" ADD CONSTRAINT "EntranceExam_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntranceExam" ADD CONSTRAINT "EntranceExam_streamId_fkey" FOREIGN KEY ("streamId") REFERENCES "Stream"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntranceExam" ADD CONSTRAINT "EntranceExam_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntranceExam" ADD CONSTRAINT "EntranceExam_secondcategoryId_fkey" FOREIGN KEY ("secondcategoryId") REFERENCES "Secondcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EntranceExam" ADD CONSTRAINT "EntranceExam_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "subcategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
