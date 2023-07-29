-- CreateTable
CREATE TABLE "UserAuditLogs" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "description" VARCHAR NOT NULL,
    "typeAction" VARCHAR NOT NULL,
    "data" VARCHAR NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAuditLogs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserAuditLogs" ADD CONSTRAINT "UserAuditLogs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
