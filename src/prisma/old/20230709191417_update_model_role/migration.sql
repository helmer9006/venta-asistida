/*
  Warnings:

  - You are about to drop the column `description` on the `Modules` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Roles` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[name]` on the table `Roles` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Roles_description_key";

-- AlterTable
ALTER TABLE "Modules" DROP COLUMN "description",
ADD COLUMN     "name" VARCHAR;

-- AlterTable
ALTER TABLE "Roles" DROP COLUMN "description",
ADD COLUMN     "name" VARCHAR;

-- CreateIndex
CREATE UNIQUE INDEX "Roles_name_key" ON "Roles"("name");
