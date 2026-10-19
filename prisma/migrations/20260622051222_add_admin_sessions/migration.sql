-- AlterTable
ALTER TABLE "AdminUsers" ADD COLUMN     "lockedUntil" TIMESTAMP(3),
ADD COLUMN     "loginAttempts" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "AdminSession" (
    "id" SERIAL NOT NULL,
    "adminId" INTEGER NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "deviceInfo" TEXT,
    "ipAddress" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AdminSession_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AdminSession_refreshToken_key" ON "AdminSession"("refreshToken");

-- AddForeignKey
ALTER TABLE "AdminSession" ADD CONSTRAINT "AdminSession_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "AdminUsers"("id") ON DELETE CASCADE ON UPDATE CASCADE;
