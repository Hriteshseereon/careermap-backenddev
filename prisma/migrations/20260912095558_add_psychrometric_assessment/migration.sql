-- CreateTable
CREATE TABLE "Assessment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "version" TEXT NOT NULL DEFAULT '1.0',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentSection" (
    "id" SERIAL NOT NULL,
    "assessmentId" INTEGER NOT NULL,
    "code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "AssessmentSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentQuestion" (
    "id" SERIAL NOT NULL,
    "sectionId" INTEGER NOT NULL,
    "itemId" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "facet" TEXT,
    "reverse" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "note" TEXT,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentOption" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "optionText" TEXT NOT NULL,
    "optionIndex" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentAttempt" (
    "id" SERIAL NOT NULL,
    "assessmentId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'in_progress',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentAnswer" (
    "id" SERIAL NOT NULL,
    "attemptId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "selectedOptionId" INTEGER,
    "likertValue" INTEGER,
    "answeredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentAnswer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AssessmentResult" (
    "id" SERIAL NOT NULL,
    "attemptId" INTEGER NOT NULL,
    "hollandCode" TEXT,
    "topCareerCluster" TEXT,
    "topCareerMatch" DOUBLE PRECISION,
    "scores" JSONB NOT NULL,
    "top5Clusters" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AssessmentResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerCluster" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "hollandCode" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CareerCluster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerClusterWeight" (
    "id" SERIAL NOT NULL,
    "clusterId" INTEGER NOT NULL,
    "facet" TEXT NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "CareerClusterWeight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Assessment_slug_key" ON "Assessment"("slug");

-- CreateIndex
CREATE INDEX "AssessmentSection_assessmentId_idx" ON "AssessmentSection"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentSection_assessmentId_code_key" ON "AssessmentSection"("assessmentId", "code");

-- CreateIndex
CREATE INDEX "AssessmentQuestion_sectionId_idx" ON "AssessmentQuestion"("sectionId");

-- CreateIndex
CREATE INDEX "AssessmentQuestion_facet_idx" ON "AssessmentQuestion"("facet");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentQuestion_sectionId_itemId_key" ON "AssessmentQuestion"("sectionId", "itemId");

-- CreateIndex
CREATE INDEX "AssessmentOption_questionId_idx" ON "AssessmentOption"("questionId");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentOption_questionId_optionIndex_key" ON "AssessmentOption"("questionId", "optionIndex");

-- CreateIndex
CREATE INDEX "AssessmentAttempt_userId_idx" ON "AssessmentAttempt"("userId");

-- CreateIndex
CREATE INDEX "AssessmentAttempt_assessmentId_idx" ON "AssessmentAttempt"("assessmentId");

-- CreateIndex
CREATE INDEX "AssessmentAnswer_attemptId_idx" ON "AssessmentAnswer"("attemptId");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentAnswer_attemptId_questionId_key" ON "AssessmentAnswer"("attemptId", "questionId");

-- CreateIndex
CREATE UNIQUE INDEX "AssessmentResult_attemptId_key" ON "AssessmentResult"("attemptId");

-- CreateIndex
CREATE UNIQUE INDEX "CareerCluster_code_key" ON "CareerCluster"("code");

-- CreateIndex
CREATE INDEX "CareerClusterWeight_clusterId_idx" ON "CareerClusterWeight"("clusterId");

-- CreateIndex
CREATE UNIQUE INDEX "CareerClusterWeight_clusterId_facet_key" ON "CareerClusterWeight"("clusterId", "facet");

-- AddForeignKey
ALTER TABLE "AssessmentSection" ADD CONSTRAINT "AssessmentSection_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentQuestion" ADD CONSTRAINT "AssessmentQuestion_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "AssessmentSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentOption" ADD CONSTRAINT "AssessmentOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "AssessmentQuestion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentAttempt" ADD CONSTRAINT "AssessmentAttempt_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "Assessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentAnswer" ADD CONSTRAINT "AssessmentAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "AssessmentAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentAnswer" ADD CONSTRAINT "AssessmentAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "AssessmentQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentAnswer" ADD CONSTRAINT "AssessmentAnswer_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "AssessmentOption"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentResult" ADD CONSTRAINT "AssessmentResult_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "AssessmentAttempt"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerClusterWeight" ADD CONSTRAINT "CareerClusterWeight_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "CareerCluster"("id") ON DELETE CASCADE ON UPDATE CASCADE;
