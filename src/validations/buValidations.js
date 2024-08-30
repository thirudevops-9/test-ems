"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VEditBenchPocEmployee = void 0;
const joi_1 = __importDefault(require("joi"));
exports.VEditBenchPocEmployee = joi_1.default.object({
    employeeId: joi_1.default.number().integer().required(),
    status: joi_1.default.number().integer().valid(0, 1),
    user: joi_1.default.any()
});
