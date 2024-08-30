/*
  Warnings:

  - You are about to drop the column `p1_contact_1` on the `EmergencyDetails` table. All the data in the column will be lost.
  - You are about to drop the column `p2_contact_1` on the `EmergencyDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmergencyDetails" DROP COLUMN "p1_contact_1",
DROP COLUMN "p2_contact_1",
ADD COLUMN     "p1_contact" VARCHAR(15),
ADD COLUMN     "p2_contact" VARCHAR(15);
