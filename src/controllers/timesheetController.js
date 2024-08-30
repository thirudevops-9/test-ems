"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.approveRejectTask = exports.managerGetTaskUnderReview = exports.managerTaskHistory = exports.editTask = exports.deleteTask = exports.listTasks = exports.createTask = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const Helpers_1 = require("../common/Helpers");
const timesheetValidations_1 = require("../validations/timesheetValidations");
const createTask = async (req, res) => {
    try {
        let errors = Helpers_1.Helpers.validate(timesheetValidations_1.VCreateTask, req.body);
        if (errors.length) {
            return Helpers_1.Helpers.errorResponse(400, res, "Validation Errors", errors);
        }
        const { taskType, projectId, date, timeTaken, description, blocker } = req.body;
        const { userId, userRole } = req.body.user;
        const createdTask = await prisma_1.default.timesheet.create({
            data: {
                employeeId: userId,
                projectId,
                taskType,
                date,
                timeTaken,
                description,
                blocker,
                verifiedStatus: 0
            }
        });
        return Helpers_1.Helpers.successResponse(200, createdTask, res, "Data Created Successfully");
    }
    catch (err) {
        console.log("createTask: Error", err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.createTask = createTask;
const listTasks = async (req, res) => {
    var _a, _b;
    try {
        const { userId, userRole } = req.body.user;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const offset = req.query.offset ? Number(req.query.offset) : 0;
        const taskType = req.query.taskType ? Number(req.query.taskType) : 0;
        const projectId = req.query.projectId ? Number(req.query.projectId) : 0;
        const verifiedStatus = req.query.verifiedStatus ? Number(req.query.verifiedStatus) : -1;
        const sortBy = (_a = req.query.sortBy) !== null && _a !== void 0 ? _a : 'date';
        const sortOrder = (_b = req.query.sortOrder) !== null && _b !== void 0 ? _b : 'desc';
        const startDate = req.query.startDate ? String(req.query.startDate) : null;
        const endDate = req.query.endDate ? String(req.query.endDate) : null;
        const search = req.query.search ? String(req.query.search) : null;
        const whereClause = {
            employeeId: userId
        };
        if (search) {
            whereClause.project = {};
            whereClause.project.projectName = {};
            whereClause.project.projectName.contains = search;
            whereClause.project.projectName.mode = 'insensitive';
        }
        if (taskType) {
            whereClause.taskType = taskType;
        }
        if (projectId) {
            whereClause.projectId = projectId;
        }
        if (verifiedStatus != -1) {
            whereClause.verifiedStatus = verifiedStatus;
        }
        if (startDate && endDate) {
            whereClause.date = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }
        let orderBy = {
            createdAt: 'desc'
        };
        if (sortBy == 'projectName') {
            orderBy = {};
            orderBy = {
                project: {
                    projectName: sortOrder
                }
            };
        }
        if (sortBy == 'taskType') {
            orderBy = {};
            orderBy = {
                taskType: sortOrder
            };
        }
        if (sortBy == 'taskDate') {
            orderBy = {};
            orderBy = {
                date: sortOrder
            };
        }
        const total = await prisma_1.default.timesheet.count({
            where: whereClause
        });
        const tasksData = await prisma_1.default.timesheet.findMany({
            include: {
                project: {
                    select: {
                        id: true,
                        projectName: true
                    }
                }
            },
            where: whereClause,
            orderBy,
            take: limit,
            skip: offset
        });
        const formattedTasks = tasksData.map(task => {
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
        return Helpers_1.Helpers.successResponse(200, { tasks: formattedTasks, limit, offset, total }, res);
    }
    catch (err) {
        console.log("createTask: Error", err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.listTasks = listTasks;
const deleteTask = async (req, res) => {
    try {
        const { userId, userRole } = req.body.user;
        let errors = Helpers_1.Helpers.validate(timesheetValidations_1.VDeleteTask, req.body);
        if (errors.length) {
            return Helpers_1.Helpers.errorResponse(400, res, "Validation Errors", errors);
        }
        const { taskId } = req.body;
        if (!taskId)
            return Helpers_1.Helpers.errorResponse(400, res, "Bad Request");
        const deleteTaskData = await prisma_1.default.timesheet.delete({
            where: {
                id: taskId,
                employeeId: userId
            }
        });
        return Helpers_1.Helpers.successResponse(200, {}, res, "Task Deleted Succesfully");
    }
    catch (err) {
        console.log("deleteTask: Error", err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.deleteTask = deleteTask;
const editTask = async (req, res) => {
    try {
        const { userId, userRole } = req.body.user;
        let errors = Helpers_1.Helpers.validate(timesheetValidations_1.VEditTask, req.body);
        if (errors.length) {
            return Helpers_1.Helpers.errorResponse(400, res, "Validation Errors", errors);
        }
        const { taskId, taskType, projectId, date, timeTaken, description, blocker } = req.body;
        if (!taskId)
            return Helpers_1.Helpers.errorResponse(400, res, "Bad Request");
        const updateData = {};
        if (taskType !== undefined)
            updateData.taskType = taskType;
        if (projectId !== undefined)
            updateData.projectId = projectId;
        if (date !== undefined)
            updateData.date = date;
        if (timeTaken !== undefined)
            updateData.timeTaken = timeTaken;
        if (description !== undefined)
            updateData.description = description;
        if (blocker !== undefined)
            updateData.blocker = blocker;
        const editTaskData = await prisma_1.default.timesheet.update({
            where: {
                id: taskId,
                employeeId: userId
            },
            data: updateData
        });
        return Helpers_1.Helpers.successResponse(200, editTaskData, res, "Data Updated Successfully");
    }
    catch (err) {
        console.log("editTask: Error", err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.editTask = editTask;
const managerTaskHistory = async (req, res) => {
    var _a, _b;
    try {
        const { userId, userRole } = req.body.user;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const offset = req.query.offset ? Number(req.query.offset) : 0;
        const taskType = req.query.taskType ? Number(req.query.taskType) : 0;
        const projectId = req.query.projectId ? Number(req.query.projectId) : 0;
        const verifiedStatus = req.query.verifiedStatus ? Number(req.query.verifiedStatus) : -1;
        const sortBy = (_a = req.query.sortBy) !== null && _a !== void 0 ? _a : 'date';
        const sortOrder = (_b = req.query.sortOrder) !== null && _b !== void 0 ? _b : 'desc';
        const startDate = req.query.startDate ? String(req.query.startDate) : null;
        const endDate = req.query.endDate ? String(req.query.endDate) : null;
        const search = req.query.search ? String(req.query.search) : null;
        const whereClause = {
            employee: {
                employeeManagers: {
                    some: {
                        managerId: userId
                    }
                }
            },
            verifiedStatus: {
                in: [1, 2] // 1 = rejected, 2 = accepted
            }
        };
        if (taskType) {
            whereClause.taskType = taskType;
        }
        if (projectId) {
            whereClause.projectId = projectId;
        }
        if (verifiedStatus != -1) {
            whereClause.verifiedStatus = verifiedStatus;
        }
        if (startDate && endDate) {
            whereClause.date = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }
        if (search) {
            whereClause.OR = [
                {
                    project: {
                        projectName: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                },
                {
                    employee: {
                        firstName: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                },
                {
                    employee: {
                        lastName: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                }
            ];
        }
        let orderBy = {
            createdAt: 'desc'
        };
        if (sortBy == 'projectName') {
            orderBy = {};
            orderBy = {
                project: {
                    projectName: sortOrder
                }
            };
        }
        if (sortBy == 'taskType') {
            orderBy = {};
            orderBy = {
                taskType: sortOrder
            };
        }
        if (sortBy == 'taskDate') {
            orderBy = {};
            orderBy = {
                date: sortOrder
            };
        }
        const total = await prisma_1.default.timesheet.count({
            where: whereClause
        });
        const timesheetHistory = await prisma_1.default.timesheet.findMany({
            select: {
                id: true,
                employeeId: true,
                projectId: true,
                taskType: true,
                date: true,
                timeTaken: true,
                description: true,
                blocker: true,
                verifiedStatus: true,
                createdAt: true,
                updatedAt: true,
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        middleName: true,
                        lastName: true,
                    }
                },
                project: {
                    select: {
                        id: true,
                        projectName: true
                    }
                }
            },
            where: whereClause,
            orderBy,
            take: limit,
            skip: offset
        });
        const formattedTasks = timesheetHistory.map(task => {
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
                employee: task.employee
            });
        });
        return Helpers_1.Helpers.successResponse(200, { tasks: formattedTasks, limit, offset, total }, res);
    }
    catch (err) {
        console.error("employeeTaskHistory: Error", err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.managerTaskHistory = managerTaskHistory;
const managerGetTaskUnderReview = async (req, res) => {
    var _a, _b;
    try {
        const { userId, userRole } = req.body.user;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const offset = req.query.offset ? Number(req.query.offset) : 0;
        const taskType = req.query.taskType ? Number(req.query.taskType) : 0;
        const projectId = req.query.projectId ? Number(req.query.projectId) : 0;
        const verifiedStatus = req.query.verifiedStatus ? Number(req.query.verifiedStatus) : -1;
        const sortBy = (_a = req.query.sortBy) !== null && _a !== void 0 ? _a : 'date';
        const sortOrder = (_b = req.query.sortOrder) !== null && _b !== void 0 ? _b : 'desc';
        const startDate = req.query.startDate ? String(req.query.startDate) : null;
        const endDate = req.query.endDate ? String(req.query.endDate) : null;
        const search = req.query.search ? String(req.query.search) : null;
        const whereClause = {
            employee: {
                employeeManagers: {
                    some: {
                        managerId: userId
                    }
                }
            },
            verifiedStatus: {
                in: [0] //  0 = task under review
            },
        };
        if (taskType) {
            whereClause.taskType = taskType;
        }
        if (projectId) {
            whereClause.projectId = projectId;
        }
        if (verifiedStatus != -1) {
            whereClause.verifiedStatus = verifiedStatus;
        }
        if (startDate && endDate) {
            whereClause.date = {
                gte: new Date(startDate),
                lte: new Date(endDate)
            };
        }
        if (search) {
            whereClause.OR = [
                {
                    project: {
                        projectName: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                },
                {
                    employee: {
                        firstName: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                },
                {
                    employee: {
                        lastName: {
                            contains: search,
                            mode: 'insensitive'
                        }
                    }
                }
            ];
        }
        let orderBy = {
            createdAt: 'desc'
        };
        if (sortBy == 'projectName') {
            orderBy = {};
            orderBy = {
                project: {
                    projectName: sortOrder
                }
            };
        }
        if (sortBy == 'taskType') {
            orderBy = {};
            orderBy = {
                taskType: sortOrder
            };
        }
        if (sortBy == 'taskDate') {
            orderBy = {};
            orderBy = {
                date: sortOrder
            };
        }
        const total = await prisma_1.default.timesheet.count({
            where: whereClause
        });
        const timesheetInReview = await prisma_1.default.timesheet.findMany({
            select: {
                id: true,
                employeeId: true,
                projectId: true,
                taskType: true,
                date: true,
                timeTaken: true,
                description: true,
                blocker: true,
                verifiedStatus: true,
                createdAt: true,
                updatedAt: true,
                employee: {
                    select: {
                        id: true,
                        firstName: true,
                        middleName: true,
                        lastName: true,
                    }
                },
                project: {
                    select: {
                        id: true,
                        projectName: true
                    }
                }
            },
            where: whereClause,
            orderBy,
            take: limit,
            skip: offset
        });
        const formattedTasks = timesheetInReview.map(task => {
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
                employee: task.employee
            });
        });
        return Helpers_1.Helpers.successResponse(200, { tasks: formattedTasks, limit, offset, total }, res);
    }
    catch (err) {
        console.error("managerGetTaskUnderReview: Error", err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.managerGetTaskUnderReview = managerGetTaskUnderReview;
const approveRejectTask = async (req, res) => {
    try {
        const { userId, userRole } = req.body.user;
        let errors = Helpers_1.Helpers.validate(timesheetValidations_1.VApproveRejectTask, req.body);
        if (errors.length) {
            return Helpers_1.Helpers.errorResponse(400, res, "Validation Errors", errors);
        }
        let { taskIds, action, select } = req.body; // action = 1 ->  reject, action = 2 -> approve
        console.log(taskIds, action);
        if (!action || (action != 1 && action != 2))
            return Helpers_1.Helpers.errorResponse(400, res, "Bad Request");
        const whereClause = {};
        const allTasksUnderReview = await prisma_1.default.timesheet.findMany({
            select: {
                id: true
            },
            where: {
                employee: {
                    employeeManagers: {
                        some: {
                            managerId: userId
                        }
                    }
                },
                verifiedStatus: {
                    in: [0] //  0 = task under review
                },
            }
        });
        const allTaskIds = allTasksUnderReview.map((task => task.id));
        const timesheetInReview = await prisma_1.default.timesheet.findMany({
            select: {
                id: true,
            },
            where: whereClause,
        });
        if (select == 'all') {
            taskIds = allTaskIds;
        }
        whereClause.id = {
            in: taskIds
        };
        const updateTask = await prisma_1.default.timesheet.updateMany({
            where: whereClause,
            data: {
                verifiedStatus: action,
            }
        });
        return Helpers_1.Helpers.successResponse(200, updateTask, res, "Task Updated Successfully");
    }
    catch (err) {
        console.error("reviewTask: Error", err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.approveRejectTask = approveRejectTask;
