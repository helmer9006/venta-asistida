-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "allyId" INTEGER;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_allyId_fkey" FOREIGN KEY ("allyId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
