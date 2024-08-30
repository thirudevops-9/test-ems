/*
  Warnings:

  - You are about to drop the column `pan_card_number` on the `BankDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "BankDetails" DROP COLUMN "pan_card_number";

-- AlterTable
ALTER TABLE "EmployeeDetails" ADD COLUMN     "pan_card_number" TEXT;
