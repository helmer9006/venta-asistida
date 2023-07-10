-- AlterTable
ALTER TABLE "Permission" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "isActive" SET DEFAULT true;
