/*
  Warnings:

  - A unique constraint covering the columns `[advisorId,allyId]` on the table `AlliesAdvisor` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "AlliesAdvisor_advisorId_allyId_key" ON "AlliesAdvisor"("advisorId", "allyId");
