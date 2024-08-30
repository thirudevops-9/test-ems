/*
  Warnings:

  - You are about to drop the `Employee` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Employee";

-- CreateTable
CREATE TABLE "EmployeeDetails" (
    "id" SERIAL NOT NULL,
    "first_name" VARCHAR(512) NOT NULL,
    "title" VARCHAR(1024) NOT NULL,
    "description" VARCHAR(2048) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeDetails_pkey" PRIMARY KEY ("id")
);
