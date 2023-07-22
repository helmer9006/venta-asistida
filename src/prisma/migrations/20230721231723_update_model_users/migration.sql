/*
  Warnings:

  - Added the required column `advisorEndDate` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `advisorStartDate` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "advisorEndDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "advisorStartDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "supervisorId" INTEGER;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_supervisorId_fkey" FOREIGN KEY ("supervisorId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
