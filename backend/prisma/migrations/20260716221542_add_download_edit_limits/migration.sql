-- AlterTable
ALTER TABLE "User" ADD COLUMN     "editsThisMonth" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastDownloadAt" TIMESTAMP(3),
ADD COLUMN     "lastEditResetAt" TIMESTAMP(3);
