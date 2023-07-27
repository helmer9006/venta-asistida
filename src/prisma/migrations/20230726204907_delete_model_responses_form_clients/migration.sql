/*
  Warnings:

  - You are about to drop the `ResponsesFormClients` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ResponsesFormClients" DROP CONSTRAINT "ResponsesFormClients_allyId_fkey";

-- DropTable
DROP TABLE "ResponsesFormClients";
