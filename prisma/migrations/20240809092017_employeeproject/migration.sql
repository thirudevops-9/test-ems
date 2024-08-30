-- AlterTable
ALTER TABLE "EmployeeProject" ADD COLUMN     "role" TEXT;

-- AlterTable
ALTER TABLE "Timesheet" ALTER COLUMN "verified_status" SET DEFAULT 0;
