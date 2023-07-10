-- CreateTable
CREATE TABLE "User" (
    "userId" SERIAL NOT NULL,
    "customerName" VARCHAR,
    "age" INTEGER,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userId")
);
