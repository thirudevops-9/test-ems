"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewEmployeeTasks = exports.viewManagerEmployee = exports.getManagerEmployees = void 0;
const Helpers_1 = require("../common/Helpers");
const prisma_1 = __importDefault(require("../../prisma"));
const s3Config_1 = require("../common/s3Config");
const getManagerEmployees = async (req, res) => {
    try {
        const { userId, userRole } = req.body.user; // only allow manager roles for this API, TODO: add role validation here
        const employeeListData = await prisma_1.default.employeeDetails.findMany({
            select: {
                id: true,
                firstName: true,
                middleName: true,
                lastName: true,
                benchOrPoc: true,
                currentCompanyDetails: {
                    select: {
                        designationMaster: true
                    }
                },
                employeeResumes: {
                    select: {
                        skills: true
                    }
                },
                employeeProjects: {
                    select: {
                        id: true,
                        employeeId: true,
                        assignedDate: true,
                        isBillable: true,
                        role: true,
                        project: true
                    }
                }
            },
            where: {
                employeeManagers: {
                    some: {
                        managerId: userId
                    }
                }
            }
        });
        const flattenedEmployeeList = employeeListData.map(employee => {
            var _a;
            let status;
            if (employee.employeeProjects.length === 0) {
                status = (_a = employee.benchOrPoc) !== null && _a !== void 0 ? _a : 0;
            }
            else if (employee.employeeProjects.some(project => project.isBillable)) {
                status = 3; // billable
            }
            else {
                status = 2; // non-billable
            }
            return Object.assign(Object.assign({}, employee), { status });
        });
        return Helpers_1.Helpers.successResponse(200, flattenedEmployeeList, res);
    }
    catch (err) {
        console.error('getManagerEmployees error:', err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.getManagerEmployees = getManagerEmployees;
const viewManagerEmployee = async (req, res) => {
    var _a, _b;
    try {
        const { userId, userRole } = req.body.user;
        const employeeId = Number(req.params.id); // TODO: add validation here
        const employeeDetails = await prisma_1.default.employeeDetails.findUnique({
            select: {
                id: true,
                companyEmail: true,
                mobileNumber: true,
                firstName: true,
                middleName: true,
                lastName: true,
                photo: true,
                currentCompanyDetails: {
                    select: {
                        designationMaster: {
                            select: {
                                designation: true
                            }
                        }
                    }
                },
                employeeResumes: {
                    select: {
                        skills: true
                    }
                },
                employeeProjects: {
                    include: {
                        project: {
                            include: {
                                timesheets: {
                                    where: {
                                        employeeId: employeeId
                                    }
                                }
                            }
                        }
                    }
                }
            },
            where: {
                id: employeeId
            }
        });
        const profilePhoto = await (0, s3Config_1.getSignedUrlByPath)(`user/${employeeDetails === null || employeeDetails === void 0 ? void 0 : employeeDetails.photo}`);
        const flattenedEmployeeData = {
            id: employeeDetails === null || employeeDetails === void 0 ? void 0 : employeeDetails.id,
            firstName: employeeDetails === null || employeeDetails === void 0 ? void 0 : employeeDetails.firstName,
            middleName: employeeDetails === null || employeeDetails === void 0 ? void 0 : employeeDetails.middleName,
            lastName: employeeDetails === null || employeeDetails === void 0 ? void 0 : employeeDetails.lastName,
            companyEmail: employeeDetails === null || employeeDetails === void 0 ? void 0 : employeeDetails.companyEmail,
            mobileNumber: employeeDetails === null || employeeDetails === void 0 ? void 0 : employeeDetails.mobileNumber,
            designation: (_b = (_a = employeeDetails === null || employeeDetails === void 0 ? void 0 : employeeDetails.currentCompanyDetails[0]) === null || _a === void 0 ? void 0 : _a.designationMaster) === null || _b === void 0 ? void 0 : _b.designation,
            skills: employeeDetails === null || employeeDetails === void 0 ? void 0 : employeeDetails.employeeResumes[0].skills,
            projects: [],
            profilePhoto
        };
        const currentDate = new Date();
        flattenedEmployeeData.projects = employeeDetails === null || employeeDetails === void 0 ? void 0 : employeeDetails.employeeProjects.map(project => {
            var _a, _b, _c;
            return ({
                id: project.id,
                projectId: project.projectId,
                projectName: (_a = project.project) === null || _a === void 0 ? void 0 : _a.projectName,
                assignedDate: project.assignedDate,
                unassignedDate: project.unassignedDate,
                isBillable: project.isBillable,
                role: project.role,
                active: project.unassignedDate === null || new Date(project.unassignedDate) > currentDate,
                taskCount: (_c = (_b = project.project) === null || _b === void 0 ? void 0 : _b.timesheets.length) !== null && _c !== void 0 ? _c : 0,
            });
        });
        return Helpers_1.Helpers.successResponse(200, flattenedEmployeeData, res);
    }
    catch (err) {
        console.error('viewManagerEmployee error:', err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.viewManagerEmployee = viewManagerEmployee;
const viewEmployeeTasks = async (req, res) => {
    try {
        const { userId, userRole } = req.body.user;
        const employeeId = Number(req.params.id);
        const employeeTasksData = await prisma_1.default.timesheet.findMany({
            include: {
                project: {
                    select: {
                        id: true,
                        projectName: true
                    }
                }
            },
            where: {
                employeeId
            },
            orderBy: {
                id: 'desc'
            }
        });
        const formattedTasks = employeeTasksData.map(task => {
            var _a, _b;
            return ({
                id: task.id,
                employeeId: task.employeeId,
                projectId: ((_a = task.project) === null || _a === void 0 ? void 0 : _a.id) || null,
                projectName: ((_b = task.project) === null || _b === void 0 ? void 0 : _b.projectName) || null,
                taskType: task.taskType,
                date: task.date,
                timeTaken: task.timeTaken,
                description: task.description,
                blocker: task.blocker,
                verifiedStatus: task.verifiedStatus,
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
            });
        });
        return Helpers_1.Helpers.successResponse(200, formattedTasks, res);
    }
    catch (err) {
        console.error('viewEmployeeTasks error:', err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.viewEmployeeTasks = viewEmployeeTasks;
