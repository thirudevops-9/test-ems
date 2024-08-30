/*
  Warnings:

  - You are about to drop the column `blood_group` on the `EmergencyDetails` table. All the data in the column will be lost.
  - You are about to drop the column `p1_contact_2` on the `EmergencyDetails` table. All the data in the column will be lost.
  - You are about to drop the column `p2_contact_2` on the `EmergencyDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmergencyDetails" DROP COLUMN "blood_group",
DROP COLUMN "p1_contact_2",
DROP COLUMN "p2_contact_2",
ADD COLUMN     "address1" TEXT,
ADD COLUMN     "address2" TEXT,
ADD COLUMN     "email1" TEXT,
ADD COLUMN     "email2" TEXT;
