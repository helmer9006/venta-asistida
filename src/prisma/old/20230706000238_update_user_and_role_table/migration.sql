/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "User_roleId_key";

-- CreateTable
CREATE TABLE "Modules" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Modules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operations" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR,
    "path" VARCHAR,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolOperation" (
    "id" SERIAL NOT NULL,
    "rolId" INTEGER NOT NULL,
    "operationId" INTEGER NOT NULL,

    CONSTRAINT "RolOperation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Operations_description_key" ON "Operations"("description");

-- CreateIndex
CREATE UNIQUE INDEX "Operations_path_key" ON "Operations"("path");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "RolOperation" ADD CONSTRAINT "RolOperation_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolOperation" ADD CONSTRAINT "RolOperation_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "Operations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
