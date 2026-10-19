-- CreateTable
CREATE TABLE "PsychometricAssessment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "studentName" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "school" TEXT,
    "testVersion" TEXT,
    "answers" JSONB NOT NULL,
    "report" JSONB NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PsychometricAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PsychometricAssessment_userId_idx" ON "PsychometricAssessment"("userId");

-- AddForeignKey
ALTER TABLE "PsychometricAssessment" ADD CONSTRAINT "PsychometricAssessment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
