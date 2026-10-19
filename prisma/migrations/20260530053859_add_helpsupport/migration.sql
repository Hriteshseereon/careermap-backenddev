-- CreateTable
CREATE TABLE "HelpAndSupport" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "email" TEXT,
    "subject" TEXT,
    "message" TEXT,
    "status" TEXT DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HelpAndSupport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "HelpAndSupport" ADD CONSTRAINT "HelpAndSupport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
