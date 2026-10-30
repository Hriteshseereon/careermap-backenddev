-- CreateTable
CREATE TABLE "send_message" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "name" TEXT,
    "email_id" TEXT,
    "phone_no" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "send_message_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "send_message_userId_idx" ON "send_message"("userId");

-- AddForeignKey
ALTER TABLE "send_message" ADD CONSTRAINT "send_message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
