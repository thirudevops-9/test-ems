"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const md5_1 = __importDefault(require("md5"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// use `prisma` in your application to read and write data in your DB
async function createEmployee() {
    var _a;
    const user = await prisma.employeeDetails.create({ data: { firstName: "HR", lastName: "Admin", gender: 1, birthDate: new Date("12-03-1998").toISOString(), mobileNumber: "11111111111", companyEmail: "hradmin@gmail.com", currentAddress: "Pune", permanentAddress: "Pune", bloodGroup: "O+", height: "6'1", weight: 65 } });
    const loginDetail = await prisma.loginDetails.create({
        data: {
            id: user.id,
            username: (_a = user.companyEmail) !== null && _a !== void 0 ? _a : "",
            password: (0, md5_1.default)("123456")
        }
    });
    console.log("loginDetail:", loginDetail);
    console.log("user: ", user);
}
async function createEmployee1() {
    var _a;
    const user = await prisma.employeeDetails.create({ data: { firstName: "John", middleName: "R", lastName: "Manager", gender: 1, birthDate: new Date("12-03-1997").toISOString(), mobileNumber: "11111111111", companyEmail: "johnmanager@gmail.com", currentAddress: "Pune", permanentAddress: "Pune", bloodGroup: "A+", height: "5'11", weight: 65 } });
    const loginDetail = await prisma.loginDetails.create({
        data: {
            id: user.id,
            username: (_a = user.companyEmail) !== null && _a !== void 0 ? _a : "",
            password: (0, md5_1.default)("Welcome@Infogen")
        }
    });
    console.log("loginDetail:", loginDetail);
    console.log("user: ", user);
}
async function createGenders() {
    const genders = await prisma.masterGender.createMany({
        data: [
            {
                id: 1,
                gender: "Male"
            },
            {
                id: 2,
                gender: "Female"
            },
            {
                id: 3,
                gender: "Other"
            }
        ]
    });
}
async function createRoles() {
    const roles = await prisma.masterRoles.createManyAndReturn({
        data: [
            {
                id: 1,
                name: "Employee"
            },
            {
                id: 2,
                name: "People Manager"
            },
            {
                id: 3,
                name: "BU Head"
            },
            {
                id: 4,
                name: "HR Employee"
            },
            {
                id: 5,
                name: "HR Admin"
            },
            {
                id: 6,
                name: "Office Admin"
            },
            {
                id: 7,
                name: "Accountant"
            },
            {
                id: 8,
                name: "Auditor"
            }
        ]
    });
    console.log(roles);
}
async function createEmployeeRole() {
    const employeeRole = await prisma.employeeDetailRole.create({
        data: {
            employeeDetailsId: 5,
            masterRoleId: 5
        }
    });
    console.log(employeeRole);
}
async function createTasks() {
    const date = new Date('2024-08-12');
    const tasks = await prisma.timesheet.createManyAndReturn({
        data: [
            {
                employeeId: 1,
                projectId: null,
                taskType: 1,
                date: date.toISOString(),
                timeTaken: 5,
                description: "API Development",
                blocker: "No access to Repo, could not push",
                verifiedStatus: 0
            },
            {
                employeeId: 1,
                projectId: null,
                taskType: 1,
                date: date.toISOString(),
                timeTaken: 4,
                description: "Unit Testing",
                verifiedStatus: 0
            }
        ]
    });
}
async function createHolidays() {
    const holidays = await prisma.holiday.createMany({
        data: [
            {
                name: "Republic Day of India",
                date: "2024-01-26T00:00:00.000Z"
            },
            {
                name: "Holi (Second Day)",
                date: "2024-03-25T00:00:00.000Z"
            },
            {
                name: "Ramzan",
                date: "2024-04-11T00:00:00.000Z"
            },
            {
                name: "May / Maharashtra Day",
                date: "2024-05-01T00:00:00.000Z"
            },
            {
                name: "Independence Day",
                date: "2024-08-15T00:00:00.000Z"
            },
            {
                name: "Gandhi Jayanthi",
                date: "2024-10-02T00:00:00.000Z"
            },
            {
                name: "Deepavali",
                date: "2024-11-01T00:00:00.000Z"
            },
            {
                name: "Christmas",
                date: "2024-12-25T00:00:00.000Z"
            }
        ]
    });
    console.log("holidays: ", holidays);
}
async function createMasterBusinessUnit() {
    const BU = await prisma.masterBusinessUnit.createManyAndReturn({
        data: [
            {
                businessUnitName: "Technology",
                businessUnitHeadEmployeeId: 2,
            }
        ]
    });
}
async function createProject() {
    const project = await prisma.project.create({
        data: {
            projectName: "EMS",
            technology: "NodeJS",
            startDate: "2024-01-01T00:00:00.000Z",
            status: 1,
            clientName: "None",
            businessUnit: 1,
            projectType: 2,
            currency: 1,
            billingType: 1,
        }
    });
    console.log("project: ", project);
}
async function createManager() {
    const manager = await prisma.employeeManager.create({
        data: {
            managerId: 3,
            employeeDetailsId: 1,
            isActive: 1,
        }
    });
    console.log("manager: ", manager);
}
async function createEmployeeBU() {
    const employeeBU = await prisma.employeeBUDetails.create({
        data: {
            employeeDetailsId: 2,
            employeeMasterBusinessUnitId: 1,
            percentage: 100
        }
    });
}
async function createBankDetails() {
    const bankDetails = await prisma.bankDetails.create({
        data: {
            employeeDetailsId: 1,
            accountHolderName: "Aman Kashyap",
            accountNumber: "3182310313",
            bankName: "ICICI Bank",
            aadharCardNumber: "3910238103312",
            bankIfscCode: "ICICI1231231",
            accountType: "Savings",
            bankAccountBranch: "Aundh"
        }
    });
}
async function createCurrentCompanyDetails() {
    const currentCompanyData = await prisma.currentCompanyDetails.create({
        data: {
            employeeDetailsId: 1,
            joiningDate: new Date("2023-06-19"),
            department: "NodeJS",
            yearsOfExperience: 1.2,
            resumeFileName: "resume.pdf",
            designationMasterId: 2
        }
    });
}
async function createEmployeeResume() {
    const resume = await prisma.employeeResume.create({
        data: {
            employeeDetailsId: 1,
            yearsOfExperience: 1.2,
            skills: "Many Skills",
            resumeFile: "resume.pdf"
        }
    });
}
async function createFamily() {
    const family = await prisma.familyDetails.create({
        data: {
            employeeDetailsId: 1,
            spouseName: "Something Something",
            spouseContact: "9999999999",
            spouseEmail: "spouse@gmail.com",
            spouseDob: new Date("11-02-2002"),
            childrenCount: 2,
            childName1: "child 1",
            childDob1: new Date("2019-01-01"),
            childName2: "child 2",
            childDob2: new Date("2020-01-01")
        }
    });
}
async function createDesignations() {
    const designations = await prisma.designationMaster.createManyAndReturn({
        data: [
            {
                designation: "Jr. Software Engineer"
            },
            {
                designation: "Software Engineer"
            },
            {
                designation: "Sr. Software Engineer"
            },
            {
                designation: "Technical Lead"
            },
            {
                designation: "Sr. Technical Lead"
            },
        ]
    });
}
async function createEmployeeProject() {
    const employeeProject = await prisma.employeeProject.create({
        data: {
            employeeId: 1,
            projectId: 1,
            assignedDate: new Date("2024-08-20"),
            isBillable: true,
            role: "NodeJS Dev",
        }
    });
}
async function createMilestones() {
    const milestones = await prisma.milestone.createManyAndReturn({
        data: [
            {
                name: "Refactoring Project",
                projectId: 1,
                amount: 300,
                completionDate: new Date("2024-09-20"),
                description: "Refactoring code of this Project."
            },
            {
                name: "CI/CD Pipeline",
                projectId: 1,
                amount: 100,
                completionDate: new Date("2024-09-28"),
                description: "Craete CICD pipeline for this project"
            }
        ]
    });
    console.log(milestones);
}
async function updatePassword() {
    const updatePassword = await prisma.loginDetails.update({
        data: {},
        where: {
            id: 1
        }
    });
}
// createMilestones   ()
//     .catch(e => {
//         console.error(e.message)
//     })
