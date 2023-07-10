/*
  Warnings:

  - You are about to drop the `Modules` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Operations` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `RolOperation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "RolOperation" DROP CONSTRAINT "RolOperation_operationId_fkey";

-- DropForeignKey
ALTER TABLE "RolOperation" DROP CONSTRAINT "RolOperation_rolId_fkey";

-- DropTable
DROP TABLE "Modules";

-- DropTable
DROP TABLE "Operations";

-- DropTable
DROP TABLE "RolOperation";

-- CreateTable
CREATE TABLE "Module" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Operation" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR,
    "path" VARCHAR,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "moduleId" INTEGER NOT NULL,
    "roleId" INTEGER,

    CONSTRAINT "Operation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RoleOperation" (
    "id" SERIAL NOT NULL,
    "rolId" INTEGER NOT NULL,
    "operationId" INTEGER NOT NULL,

    CONSTRAINT "RoleOperation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Operation_description_key" ON "Operation"("description");

-- CreateIndex
CREATE UNIQUE INDEX "Operation_path_key" ON "Operation"("path");

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Operation" ADD CONSTRAINT "Operation_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleOperation" ADD CONSTRAINT "RoleOperation_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RoleOperation" ADD CONSTRAINT "RoleOperation_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "Operation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
