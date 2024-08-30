/*
  Warnings:

  - You are about to alter the column `spouse_name` on the `FamilyDetails` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `spouse_contact` on the `FamilyDetails` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - You are about to alter the column `child_name_1` on the `FamilyDetails` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.
  - You are about to alter the column `child_name_2` on the `FamilyDetails` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "FamilyDetails" ALTER COLUMN "spouse_name" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "spouse_contact" SET DATA TYPE VARCHAR(15),
ALTER COLUMN "child_name_1" SET DATA TYPE VARCHAR(50),
ALTER COLUMN "child_name_2" SET DATA TYPE VARCHAR(50);
