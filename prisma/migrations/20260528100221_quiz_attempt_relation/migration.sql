-- CreateTable
CREATE TABLE "QuizAttempt" (
    "id" SERIAL NOT NULL,
    "quizId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "totalQuestions" INTEGER NOT NULL,
    "correctAnswers" INTEGER NOT NULL,
    "wrongAnswers" INTEGER NOT NULL,
    "score" TEXT NOT NULL,
    "attemptedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "QuizAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizAttemptAnswer" (
    "id" SERIAL NOT NULL,
    "attemptId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "selectedOptionId" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "QuizAttemptAnswer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_quizId_fkey" FOREIGN KEY ("quizId") REFERENCES "Quiz"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttempt" ADD CONSTRAINT "QuizAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttemptAnswer" ADD CONSTRAINT "QuizAttemptAnswer_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "QuizAttempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttemptAnswer" ADD CONSTRAINT "QuizAttemptAnswer_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "QuizQuestion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizAttemptAnswer" ADD CONSTRAINT "QuizAttemptAnswer_selectedOptionId_fkey" FOREIGN KEY ("selectedOptionId") REFERENCES "QuizOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
