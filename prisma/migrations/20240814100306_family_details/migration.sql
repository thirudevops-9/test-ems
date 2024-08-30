-- CreateTable
CREATE TABLE "FamilyDetails" (
    "id" SERIAL NOT NULL,
    "employee_details_id" INTEGER,
    "spouse_name" TEXT,
    "spouse_contact" TEXT,
    "spouse_email" TEXT,
    "spouse_dob" DATE NOT NULL,
    "children_count" INTEGER,
    "child_name_1" TEXT,
    "child_dob_1" DATE,
    "child_name_2" TEXT,
    "child_dob_2" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamilyDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "FamilyDetails" ADD CONSTRAINT "FamilyDetails_employee_details_id_fkey" FOREIGN KEY ("employee_details_id") REFERENCES "EmployeeDetails"("id") ON DELETE SET NULL ON UPDATE CASCADE;
