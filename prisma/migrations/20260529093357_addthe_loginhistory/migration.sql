-- CreateTable
CREATE TABLE "UserLoginHistory" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "ipAddress" TEXT,
    "location" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "os" TEXT,
    "loginAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserLoginHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserLoginHistory" ADD CONSTRAINT "UserLoginHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
