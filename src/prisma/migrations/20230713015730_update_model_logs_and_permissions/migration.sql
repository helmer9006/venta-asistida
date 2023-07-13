/*
  Warnings:

  - You are about to drop the `UserAuditLogs` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `code` to the `Permissions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "UserAuditLogs" DROP CONSTRAINT "UserAuditLogs_userId_fkey";

-- AlterTable
ALTER TABLE "Permissions" ADD COLUMN     "code" VARCHAR NOT NULL;

-- DropTable
DROP TABLE "UserAuditLogs";

-- CreateTable
CREATE TABLE "Logs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "description" VARCHAR NOT NULL,
    "typeAction" VARCHAR NOT NULL,
    "data" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Logs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Logs" ADD CONSTRAINT "Logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
