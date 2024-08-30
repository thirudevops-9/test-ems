/*
  Warnings:

  - You are about to drop the column `description` on the `EmployeeDetails` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `EmployeeDetails` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "EmployeeDetails" DROP COLUMN "description",
DROP COLUMN "title",
ADD COLUMN     "aadhar_number" TEXT,
ADD COLUMN     "alternate_number" TEXT,
ADD COLUMN     "birth_date" TIMESTAMP(3),
ADD COLUMN     "blood_group" TEXT,
ADD COLUMN     "company_email" TEXT,
ADD COLUMN     "current_address" TEXT,
ADD COLUMN     "emp_status" INTEGER,
ADD COLUMN     "gender" INTEGER,
ADD COLUMN     "height" TEXT,
ADD COLUMN     "last_name" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "middle_name" TEXT,
ADD COLUMN     "mobile_number" TEXT,
ADD COLUMN     "passport_number" TEXT,
ADD COLUMN     "passport_validity" TEXT,
ADD COLUMN     "permanent_address" TEXT,
ADD COLUMN     "personal_email" TEXT,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION,
ALTER COLUMN "first_name" DROP NOT NULL,
ALTER COLUMN "first_name" SET DATA TYPE TEXT,
ALTER COLUMN "created_at" SET DATA TYPE TIMESTAMP(3),
ALTER COLUMN "updated_at" SET DATA TYPE TIMESTAMP(3);

-- CreateTable
CREATE TABLE "EmployeeDetailRole" (
    "id" SERIAL NOT NULL,
    "employee_details_id" INTEGER,
    "master_role_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeDetailRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeManager" (
    "id" SERIAL NOT NULL,
    "employee_details_id" INTEGER NOT NULL,
    "manager_id" INTEGER NOT NULL,
    "is_active" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeManager_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeResume" (
    "id" SERIAL NOT NULL,
    "employee_details_id" INTEGER NOT NULL,
    "project_details" TEXT,
    "years_of_experience" INTEGER,
    "skills" TEXT,
    "education_details" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeResume_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterGender" (
    "id" SERIAL NOT NULL,
    "gender" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MasterGender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterRoles" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MasterRoles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LoginDetails" (
    "id" SERIAL NOT NULL,
    "employee_details_id" INTEGER NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LoginDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyAttendance" (
    "id" SERIAL NOT NULL,
    "employee_details_id" INTEGER,
    "in_time" TIMESTAMP(3),
    "out_time" TIMESTAMP(3),
    "status" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyAttendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmergencyDetails" (
    "id" SERIAL NOT NULL,
    "employee_details_id" INTEGER NOT NULL,
    "personal_1_name" TEXT,
    "p1_contact_1" VARCHAR(15),
    "p1_contact_2" VARCHAR(15),
    "relation_1" TEXT,
    "personal_2_name" TEXT,
    "p2_contact_1" VARCHAR(15),
    "p2_contact_2" VARCHAR(15),
    "relation_2" TEXT,
    "blood_group" VARCHAR(10),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmergencyDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "project_name" TEXT,
    "technology" TEXT,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "status" INTEGER,
    "client_name" TEXT,
    "business_unit" INTEGER,
    "project_type" INTEGER,
    "currency" INTEGER,
    "billing_type" INTEGER,
    "sowfile_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SOWFile" (
    "id" SERIAL NOT NULL,
    "project_id" INTEGER NOT NULL,
    "uploaded_date" TIMESTAMP(3),
    "original_filename" VARCHAR(255),
    "filename" VARCHAR(255),
    "filesize" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SOWFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "project_id" INTEGER,
    "amount" DOUBLE PRECISION,
    "completion_date" TIMESTAMP(3),
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER,
    "project_id" INTEGER,
    "role_expertise" TEXT,
    "weekly_hours" INTEGER,
    "duration_type" INTEGER,
    "cost" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Resource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeProject" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER,
    "project_id" INTEGER,
    "assigned_date" TIMESTAMP(3),
    "unassigned_date" TIMESTAMP(3),
    "is_billable" BOOLEAN,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CurrentCompanyDetails" (
    "id" SERIAL NOT NULL,
    "employee_details_id" INTEGER,
    "current_ctc" INTEGER,
    "joining_date" TIMESTAMP(3),
    "designation_master_id" INTEGER,
    "department_master_id" INTEGER,
    "next_raise_date" TIMESTAMP(3),
    "release_date" TIMESTAMP(3),
    "experience_skills" TEXT,
    "other_skills" TEXT,
    "years_of_experience" DOUBLE PRECISION,
    "certifications" TEXT,
    "resume_file_name" TEXT,
    "employee_type_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CurrentCompanyDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankDetails" (
    "id" SERIAL NOT NULL,
    "employee_details_id" INTEGER,
    "account_holder_name" TEXT,
    "account_number" TEXT,
    "bank_name" TEXT,
    "pan_card_number" TEXT,
    "aadhar_card_number" TEXT,
    "bank_ifsc_code" TEXT,
    "uan_number" TEXT,
    "pf_number" TEXT,
    "esic_number" TEXT,
    "bank_account_branch" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BankDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DesignationMaster" (
    "id" SERIAL NOT NULL,
    "designation" VARCHAR(60),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DesignationMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartmentMaster" (
    "id" SERIAL NOT NULL,
    "department_name" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DepartmentMaster_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterBusinessUnit" (
    "id" SERIAL NOT NULL,
    "business_unit_name" VARCHAR(50),
    "business_unit_head_employee_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MasterBusinessUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MasterEmployeeType" (
    "id" SERIAL NOT NULL,
    "employee_type_name" VARCHAR(50),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MasterEmployeeType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeBUDetails" (
    "id" SERIAL NOT NULL,
    "employee_details_id" INTEGER,
    "employee_master_business_unit_id" INTEGER,
    "percentage" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployeeBUDetails_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Timesheet" (
    "id" SERIAL NOT NULL,
    "employee_id" INTEGER,
    "project_id" INTEGER,
    "is_regularization" INTEGER,
    "task_type" INTEGER,
    "date" TIMESTAMP(3),
    "time_taken" INTEGER,
    "description" TEXT,
    "verified_status" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Timesheet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LoginDetails_employee_details_id_key" ON "LoginDetails"("employee_details_id");

-- AddForeignKey
ALTER TABLE "EmployeeDetails" ADD CONSTRAINT "EmployeeDetails_gender_fkey" FOREIGN KEY ("gender") REFERENCES "MasterGender"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeDetailRole" ADD CONSTRAINT "EmployeeDetailRole_employee_details_id_fkey" FOREIGN KEY ("employee_details_id") REFERENCES "EmployeeDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeDetailRole" ADD CONSTRAINT "EmployeeDetailRole_master_role_id_fkey" FOREIGN KEY ("master_role_id") REFERENCES "MasterRoles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeManager" ADD CONSTRAINT "EmployeeManager_employee_details_id_fkey" FOREIGN KEY ("employee_details_id") REFERENCES "EmployeeDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeManager" ADD CONSTRAINT "EmployeeManager_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "EmployeeDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeResume" ADD CONSTRAINT "EmployeeResume_employee_details_id_fkey" FOREIGN KEY ("employee_details_id") REFERENCES "EmployeeDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LoginDetails" ADD CONSTRAINT "LoginDetails_employee_details_id_fkey" FOREIGN KEY ("employee_details_id") REFERENCES "EmployeeDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyAttendance" ADD CONSTRAINT "DailyAttendance_employee_details_id_fkey" FOREIGN KEY ("employee_details_id") REFERENCES "EmployeeDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmergencyDetails" ADD CONSTRAINT "EmergencyDetails_employee_details_id_fkey" FOREIGN KEY ("employee_details_id") REFERENCES "EmployeeDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_business_unit_fkey" FOREIGN KEY ("business_unit") REFERENCES "MasterBusinessUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SOWFile" ADD CONSTRAINT "SOWFile_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "EmployeeDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD CONSTRAINT "Resource_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeProject" ADD CONSTRAINT "EmployeeProject_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "EmployeeDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeProject" ADD CONSTRAINT "EmployeeProject_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentCompanyDetails" ADD CONSTRAINT "CurrentCompanyDetails_employee_details_id_fkey" FOREIGN KEY ("employee_details_id") REFERENCES "EmployeeDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentCompanyDetails" ADD CONSTRAINT "CurrentCompanyDetails_designation_master_id_fkey" FOREIGN KEY ("designation_master_id") REFERENCES "DesignationMaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentCompanyDetails" ADD CONSTRAINT "CurrentCompanyDetails_department_master_id_fkey" FOREIGN KEY ("department_master_id") REFERENCES "DepartmentMaster"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CurrentCompanyDetails" ADD CONSTRAINT "CurrentCompanyDetails_employee_type_id_fkey" FOREIGN KEY ("employee_type_id") REFERENCES "MasterEmployeeType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankDetails" ADD CONSTRAINT "BankDetails_employee_details_id_fkey" FOREIGN KEY ("employee_details_id") REFERENCES "EmployeeDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MasterBusinessUnit" ADD CONSTRAINT "MasterBusinessUnit_business_unit_head_employee_id_fkey" FOREIGN KEY ("business_unit_head_employee_id") REFERENCES "EmployeeDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeBUDetails" ADD CONSTRAINT "EmployeeBUDetails_employee_details_id_fkey" FOREIGN KEY ("employee_details_id") REFERENCES "EmployeeDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeBUDetails" ADD CONSTRAINT "EmployeeBUDetails_employee_master_business_unit_id_fkey" FOREIGN KEY ("employee_master_business_unit_id") REFERENCES "MasterBusinessUnit"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timesheet" ADD CONSTRAINT "Timesheet_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "EmployeeDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Timesheet" ADD CONSTRAINT "Timesheet_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "Project"("id") ON DELETE SET NULL ON UPDATE CASCADE;
