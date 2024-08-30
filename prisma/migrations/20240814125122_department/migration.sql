/*
  Warnings:

  - You are about to drop the column `department_master_id` on the `CurrentCompanyDetails` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "CurrentCompanyDetails" DROP CONSTRAINT "CurrentCompanyDetails_department_master_id_fkey";

-- AlterTable
ALTER TABLE "CurrentCompanyDetails" DROP COLUMN "department_master_id",
ADD COLUMN     "department" TEXT;
