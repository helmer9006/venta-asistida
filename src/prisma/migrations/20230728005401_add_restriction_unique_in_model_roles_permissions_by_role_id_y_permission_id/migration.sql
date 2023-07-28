/*
  Warnings:

  - A unique constraint covering the columns `[roleId,permissionId]` on the table `RolesPermissions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "RolesPermissions_roleId_permissionId_key" ON "RolesPermissions"("roleId", "permissionId");
