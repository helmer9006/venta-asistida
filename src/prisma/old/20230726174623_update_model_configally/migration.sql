/*
  Warnings:

  - A unique constraint covering the columns `[allyId]` on the table `ConfigAlly` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ConfigAlly_allyId_key" ON "ConfigAlly"("allyId");
