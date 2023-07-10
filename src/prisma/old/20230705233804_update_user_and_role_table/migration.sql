/*
  Warnings:

  - You are about to drop the column `rolesId` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[roleId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_rolesId_fkey";

-- DropIndex
DROP INDEX "User_rolesId_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "rolesId",
ADD COLUMN     "roleId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "User_roleId_key" ON "User"("roleId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
