"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editPocBenchEmployee = exports.getMasterBusinessUnits = exports.editEmployee = exports.BUHeadEmployeeList = void 0;
const Helpers_1 = require("../common/Helpers");
const prisma_1 = __importDefault(require("../../prisma"));
const buValidations_1 = require("../validations/buValidations");
const BUHeadEmployeeList = async (req, res) => {
    try {
        const { userId, userRole } = req.body.user;
        // get own bu id
        const buDetails = await prisma_1.default.masterBusinessUnit.findFirst({
            where: {
                businessUnitHeadEmployeeId: userId
            }
        });
        const employeeListData = await prisma_1.default.employeeDetails.findMany({
            select: {
                id: true,
                firstName: true,
                middleName: true,
                lastName: true,
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
                employeeProjects: true
            },
            where: {
                EmployeeBUDetails: {
                    some: {
                        employeeMasterBusinessUnitId: buDetails === null || buDetails === void 0 ? void 0 : buDetails.id
                    }
                },
                id: {
                    not: userId // dont include self
                }
            }
        });
        return Helpers_1.Helpers.successResponse(200, employeeListData, res);
    }
    catch (err) {
        console.log("BUHeadEmployeeList: Error", err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.BUHeadEmployeeList = BUHeadEmployeeList;
const editEmployee = async (req, res) => {
    try {
        const { userId, userRole } = req.body.user;
        const employeeId = req.body.employeeId;
        // TODO: joi validations
        const BUId = req.body.BUId;
        const addProjects = req.body.addProjects; // array
        const deleteProjects = req.body.deleteProjects; // ids of projects
        if (addProjects === null || addProjects === void 0 ? void 0 : addProjects.length) {
            const addProjectsData = addProjects.map((addProject) => (Object.assign(Object.assign({}, addProject), { assignedDate: new Date() })));
            const assignProject = await prisma_1.default.employeeProject.createMany({
                data: addProjectsData
            });
        }
        if (BUId) {
            const updateEmployeeBU = await prisma_1.default.employeeBUDetails.updateMany({
                data: {
                    employeeMasterBusinessUnitId: BUId,
                },
                where: {
                    employeeDetailsId: employeeId
                }
            });
        }
        if (deleteProjects === null || deleteProjects === void 0 ? void 0 : deleteProjects.length) {
            const today = new Date('YYYY-MM-DD');
            const updateEmployeeProjects = await prisma_1.default.employeeProject.updateMany({
                data: {
                    unassignedDate: today
                },
                where: {
                    id: {
                        in: deleteProjects
                    }
                }
            });
        }
        return Helpers_1.Helpers.successResponse(200, {}, res, "Employee Updated Successfully");
    }
    catch (err) {
        console.log("editEmployee: Error", err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.editEmployee = editEmployee;
const getMasterBusinessUnits = async (req, res) => {
    try {
        const businessUnitData = await prisma_1.default.masterBusinessUnit.findMany();
        return Helpers_1.Helpers.successResponse(200, businessUnitData, res);
    }
    catch (err) {
        console.log("getBusinessUnits: Error", err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.getMasterBusinessUnits = getMasterBusinessUnits;
const editPocBenchEmployee = async (req, res) => {
    try {
        const { employeeId, status } = req.body;
        const errors = Helpers_1.Helpers.validate(buValidations_1.VEditBenchPocEmployee, req.body);
        if (errors.length)
            return Helpers_1.Helpers.errorResponse(400, res, "Validation Errors", errors);
        const updateStatus = await prisma_1.default.employeeDetails.update({
            select: {
                benchOrPoc: true
            },
            data: {
                benchOrPoc: status
            },
            where: {
                id: employeeId
            }
        });
        return Helpers_1.Helpers.successResponse(200, updateStatus, res, "Status Updated Sucessfully");
    }
    catch (err) {
        console.log("getBusinessUnits: Error", err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.editPocBenchEmployee = editPocBenchEmployee;
