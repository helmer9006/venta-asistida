-- CreateTable
CREATE TABLE "AlliesAdvisor" (
    "id" SERIAL NOT NULL,
    "advisorId" INTEGER NOT NULL,
    "allyId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "AlliesAdvisor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AlliesAdvisor" ADD CONSTRAINT "AlliesAdvisor_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
