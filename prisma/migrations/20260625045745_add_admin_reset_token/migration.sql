-- AlterTable
ALTER TABLE "AdminUsers" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);
