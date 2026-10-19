-- CreateTable
CREATE TABLE "LandingPage" (
    "id" SERIAL NOT NULL,
    "class" TEXT NOT NULL,
    "stream" TEXT NOT NULL,
    "interest" TEXT[],
    "clarity" TEXT NOT NULL,
    "strength" TEXT[],
    "priority" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "LandingPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isupgraded" BOOLEAN NOT NULL DEFAULT false,
    "country" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "dataOfBirth" TIMESTAMP(3) NOT NULL,
    "image" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LandingPage_userId_key" ON "LandingPage"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- AddForeignKey
ALTER TABLE "LandingPage" ADD CONSTRAINT "LandingPage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
