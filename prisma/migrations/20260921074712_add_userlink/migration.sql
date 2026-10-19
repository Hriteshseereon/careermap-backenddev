-- AddForeignKey
ALTER TABLE "AssessmentAttempt" ADD CONSTRAINT "AssessmentAttempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
