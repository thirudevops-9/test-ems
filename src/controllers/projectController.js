"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllProjects = exports.addMilestone = exports.viewProject = exports.getManagerProjects = exports.getEmployeeProjects = void 0;
const Helpers_1 = require("../common/Helpers");
const prisma_1 = __importDefault(require("../../prisma"));
const projectValidations_1 = require("../validations/projectValidations");
const getEmployeeProjects = async (req, res) => {
    try {
        const { userId, userRole } = req.body.user;
        const employeeProjectData = await prisma_1.default.employeeProject.findMany({
            select: {
                project: true
            },
            where: {
                employeeId: userId,
                OR: [
                    { unassignedDate: null },
                    { unassignedDate: { gte: new Date() } }
                ]
            }
        });
        return Helpers_1.Helpers.successResponse(200, employeeProjectData, res);
    }
    catch (err) {
        console.log("getEmployeeProjects: Error", err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.getEmployeeProjects = getEmployeeProjects;
const getManagerProjects = async (req, res) => {
    try {
        const { userId, userRole } = req.body.user;
        const managerProjectData = await prisma_1.default.employeeDetails.findUnique({
            where: {
                id: userId
            },
            include: {
                managedEmployees: {
                    include: {
                        employee: {
                            include: {
                                employeeProjects: {
                                    include: {
                                        project: {
                                            select: {
                                                id: true,
                                                projectName: true,
                                                projectType: true,
                                                startDate: true,
                                                teamSize: true,
                                                clientName: true,
                                                status: true,
                                                businessUnit: true,
                                                businessUnitRelation: {
                                                    select: {
                                                        businessUnitName: true
                                                    }
                                                }
                                            }
                                        },
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        const managedEmployees = (managerProjectData === null || managerProjectData === void 0 ? void 0 : managerProjectData.managedEmployees.map(relation => relation.employee)) || [];
        const allProjects = new Set();
        managedEmployees.forEach(employee => {
            employee.employeeProjects.forEach(ep => {
                var _a;
                const project = ep.project;
                allProjects.add(Object.assign(Object.assign({}, project), { businessUnitName: ((_a = project === null || project === void 0 ? void 0 : project.businessUnitRelation) === null || _a === void 0 ? void 0 : _a.businessUnitName) || null, businessUnitRelation: undefined }));
            });
        });
        const projects = Array.from(allProjects);
        projects.sort((a, b) => {
            return b.startDate - a.startDate;
        });
        return Helpers_1.Helpers.successResponse(200, projects, res);
    }
    catch (err) {
        console.log("getManagerProjects: Error", err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.getManagerProjects = getManagerProjects;
const viewProject = async (req, res) => {
    try {
        const { userId, userRole } = req.body.user;
        const projectId = Number(req.params.id);
        const projectData = await prisma_1.default.project.findUnique({
            where: { id: projectId },
            include: {
                employeeProjects: {
                    select: {
                        id: true,
                        isBillable: true,
                        role: true,
                        assignedDate: true,
                        employee: {
                            select: {
                                id: true,
                                firstName: true,
                                middleName: true,
                                lastName: true,
                            }
                        }
                    }
                },
                businessUnitRelation: {
                    select: {
                        id: true,
                        businessUnitName: true
                    }
                },
                milestones: true,
                sowFiles: true
            },
        });
        if (!projectData) {
            return Helpers_1.Helpers.errorResponse(404, res, "Project not found");
        }
        const totalTeamSize = projectData.employeeProjects.length;
        const billableTeamSize = projectData.employeeProjects.filter(ep => ep.isBillable).length;
        const nonBillableTeamSize = totalTeamSize - billableTeamSize;
        return Helpers_1.Helpers.successResponse(200, { projectData, totalTeamSize, billableTeamSize, nonBillableTeamSize }, res);
    }
    catch (err) {
        console.log("viewProject: Error", err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.viewProject = viewProject;
const addMilestone = async (req, res) => {
    try {
        const { userId, userRole } = req.body.user;
        let errors = Helpers_1.Helpers.validate(projectValidations_1.VAddMilestone, req.body);
        if (errors.length)
            Helpers_1.Helpers.errorResponse(400, res, "Validation Errors");
        const { name, projectId, amount, completionDate, description } = req.body;
        const newMilestone = await prisma_1.default.milestone.create({
            data: {
                name,
                projectId,
                amount,
                completionDate: new Date(completionDate),
                description
            }
        });
        return Helpers_1.Helpers.successResponse(200, newMilestone, res, "New Milestone Created Sucessfully");
    }
    catch (err) {
        console.log("addMilestone: Error", err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.addMilestone = addMilestone;
const getAllProjects = async (req, res) => {
    try {
        const allProjects = await prisma_1.default.project.findMany();
        return Helpers_1.Helpers.successResponse(200, allProjects, res);
    }
    catch (err) {
        console.log("getAllProjects: Error", err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.getAllProjects = getAllProjects;
