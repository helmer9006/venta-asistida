/*
  Warnings:

  - You are about to drop the column `userId` on the `Logs` table. All the data in the column will be lost.
  - Added the required column `actionUserId` to the `Logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `model` to the `Logs` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Logs" DROP CONSTRAINT "Logs_userId_fkey";

-- AlterTable
ALTER TABLE "Logs" DROP COLUMN "userId",
ADD COLUMN     "actionUserId" INTEGER NOT NULL,
ADD COLUMN     "model" VARCHAR NOT NULL,
ADD COLUMN     "modelId" INTEGER;

-- CreateTable
CREATE TABLE "ConfigAlly" (
    "id" SERIAL NOT NULL,
    "allyId" INTEGER,
    "formBase" BOOLEAN NOT NULL,
    "name" TEXT NOT NULL,
    "attributes" TEXT NOT NULL,
    "dataPolicy" TEXT NOT NULL,
    "noEssentialDataPolicy" TEXT NOT NULL,

    CONSTRAINT "ConfigAlly_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_actionUserId_fkey" FOREIGN KEY ("actionUserId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConfigAlly" ADD CONSTRAINT "ConfigAlly_allyId_fkey" FOREIGN KEY ("allyId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
