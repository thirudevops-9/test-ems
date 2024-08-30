"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VResetPassword = exports.VVerifyOTP = exports.VForgotPassword = exports.VLoginRequest = void 0;
const joi_1 = __importDefault(require("joi"));
const VJwtPayload = joi_1.default.object({
    userId: joi_1.default.number().required(),
    userRole: joi_1.default.number().optional(),
    iat: joi_1.default.number().optional(),
    exp: joi_1.default.number().optional(),
});
exports.VLoginRequest = joi_1.default.object({
    username: joi_1.default.string().required(),
    password: joi_1.default.string().min(6).max(50).required()
});
exports.VForgotPassword = joi_1.default.object({
    email: joi_1.default.string().email().required()
});
exports.VVerifyOTP = joi_1.default.object({
    otp: joi_1.default.alternatives().try(joi_1.default.string(), joi_1.default.number()).required(),
    email: joi_1.default.string().email().required()
});
exports.VResetPassword = joi_1.default.object({
    newPassword: joi_1.default.string().min(6).max(50).required(),
    user: VJwtPayload
});
