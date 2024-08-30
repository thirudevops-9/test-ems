/*
  Warnings:

  - You are about to drop the column `employee_details_id` on the `LoginDetails` table. All the data in the column will be lost.
  - You are about to drop the column `sowfile_id` on the `Project` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LoginDetails" DROP CONSTRAINT "LoginDetails_employee_details_id_fkey";

-- DropIndex
DROP INDEX "LoginDetails_employee_details_id_key";

-- AlterTable
ALTER TABLE "LoginDetails" DROP COLUMN "employee_details_id";

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "sowfile_id";

-- AddForeignKey
ALTER TABLE "LoginDetails" ADD CONSTRAINT "LoginDetails_id_fkey" FOREIGN KEY ("id") REFERENCES "EmployeeDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
