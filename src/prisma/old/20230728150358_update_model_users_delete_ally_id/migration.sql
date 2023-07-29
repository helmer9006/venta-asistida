/*
  Warnings:

  - You are about to drop the column `allyId` on the `Users` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_allyId_fkey";

-- AlterTable
ALTER TABLE "Users" DROP COLUMN "allyId";
