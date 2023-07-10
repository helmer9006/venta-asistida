/*
  Warnings:

  - You are about to drop the column `userId` on the `Role` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[description]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rolesId]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_userId_fkey";

-- DropIndex
DROP INDEX "Role_userId_key";

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "userId",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "description" VARCHAR,
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "rolesId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Role_description_key" ON "Role"("description");

-- CreateIndex
CREATE UNIQUE INDEX "User_rolesId_key" ON "User"("rolesId");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_rolesId_fkey" FOREIGN KEY ("rolesId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;
