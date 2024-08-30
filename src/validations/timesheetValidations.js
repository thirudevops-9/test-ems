"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VApproveRejectTask = exports.VDeleteTask = exports.VEditTask = exports.VCreateTask = void 0;
const joi_1 = __importDefault(require("joi"));
const VJwtPayload = joi_1.default.object({
    userId: joi_1.default.number().required(),
    userRole: joi_1.default.number().optional(),
    iat: joi_1.default.number().optional(),
    exp: joi_1.default.number().optional(),
});
exports.VCreateTask = joi_1.default.object({
    taskType: joi_1.default.number().integer().optional(),
    projectId: joi_1.default.number().integer().optional(),
    date: joi_1.default.date(),
    timeTaken: joi_1.default.number(),
    description: joi_1.default.string().optional(),
    blocker: joi_1.default.string().allow("").optional(),
    user: VJwtPayload
});
exports.VEditTask = joi_1.default.object({
    taskId: joi_1.default.number().integer().required(),
    taskType: joi_1.default.number().integer().optional(),
    projectId: joi_1.default.number().integer().allow(null).optional(),
    date: joi_1.default.date().optional(),
    timeTaken: joi_1.default.number().optional(),
    description: joi_1.default.string().optional(),
    blocker: joi_1.default.string().allow("").optional(),
    user: VJwtPayload
});
exports.VDeleteTask = joi_1.default.object({
    taskId: joi_1.default.number().integer().required(),
    user: VJwtPayload
});
exports.VApproveRejectTask = joi_1.default.object({
    taskIds: joi_1.default.array().items(joi_1.default.number().required()).optional(),
    action: joi_1.default.number().integer().allow(1, 2).required(),
    select: joi_1.default.string().optional(),
    user: VJwtPayload
});
