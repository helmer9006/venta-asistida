/*
  Warnings:

  - A unique constraint covering the columns `[identification]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Made the column `name` on table `Roles` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `identification` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `identificationType` to the `Users` table without a default value. This is not possible if the table is not empty.
  - Made the column `roleId` on table `Users` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Users" DROP CONSTRAINT "Users_roleId_fkey";

-- AlterTable
ALTER TABLE "Roles" ADD COLUMN     "description" VARCHAR,
ALTER COLUMN "name" SET NOT NULL;

-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "address" VARCHAR,
ADD COLUMN     "identification" VARCHAR NOT NULL,
ADD COLUMN     "identificationType" VARCHAR NOT NULL,
ADD COLUMN     "phone" VARCHAR,
ALTER COLUMN "roleId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_identification_key" ON "Users"("identification");

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
