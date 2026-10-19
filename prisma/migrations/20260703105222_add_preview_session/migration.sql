-- CreateTable
CREATE TABLE "PreviewSession" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "pageType" TEXT NOT NULL,
    "pageId" INTEGER NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PreviewSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PreviewSession_userId_moduleId_pageType_pageId_idx" ON "PreviewSession"("userId", "moduleId", "pageType", "pageId");

-- CreateIndex
CREATE INDEX "PreviewSession_expiresAt_idx" ON "PreviewSession"("expiresAt");

-- AddForeignKey
ALTER TABLE "PreviewSession" ADD CONSTRAINT "PreviewSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PreviewSession" ADD CONSTRAINT "PreviewSession_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
