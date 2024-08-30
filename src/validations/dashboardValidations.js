"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VCalendarOverview = void 0;
const joi_1 = __importDefault(require("joi"));
exports.VCalendarOverview = joi_1.default.object({
    month: joi_1.default.number().optional().min(1).max(12),
    year: joi_1.default.number().optional().min(2000).max(2050)
});
