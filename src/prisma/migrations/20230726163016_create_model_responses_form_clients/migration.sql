-- CreateTable
CREATE TABLE "ResponsesFormClients" (
    "id" SERIAL NOT NULL,
    "allyId" INTEGER,
    "firtsName" TEXT,
    "secondName" TEXT,
    "surname" TEXT,
    "secondSurname" TEXT,
    "birthdate" TIMESTAMP(3),
    "department" TEXT,
    "municipality" TEXT,
    "identificationType" TEXT,
    "identification" TEXT,
    "expeditionDate" TIMESTAMP(3),
    "expeditionPlace" TEXT,
    "gender" TEXT,
    "address" TEXT,
    "phoneNumber" INTEGER,
    "email" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3),

    CONSTRAINT "ResponsesFormClients_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResponsesFormClients" ADD CONSTRAINT "ResponsesFormClients_allyId_fkey" FOREIGN KEY ("allyId") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
