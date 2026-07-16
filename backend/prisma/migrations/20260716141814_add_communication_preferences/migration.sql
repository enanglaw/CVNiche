-- AlterTable
ALTER TABLE "User" ADD COLUMN     "notifyJobAlerts" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "notifyMarketing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "notifyPromos" BOOLEAN NOT NULL DEFAULT false;
