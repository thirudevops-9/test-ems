"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VAddMilestone = void 0;
const joi_1 = __importDefault(require("joi"));
exports.VAddMilestone = joi_1.default.object({
    name: joi_1.default.string().required(),
    projectId: joi_1.default.number().integer().required(),
    amount: joi_1.default.number().positive().optional().allow(null),
    description: joi_1.default.string().optional().allow(null),
    completionDate: joi_1.default.date().allow(null),
    user: joi_1.default.any()
});
