/*
  Warnings:

  - You are about to drop the column `roleId` on the `Operation` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `RoleOperation` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Operation" DROP CONSTRAINT "Operation_roleId_fkey";

-- AlterTable
ALTER TABLE "Operation" DROP COLUMN "roleId";

-- AlterTable
ALTER TABLE "RoleOperation" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
