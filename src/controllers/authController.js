"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.verifyOTP = exports.forgotPassword = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const md5_1 = __importDefault(require("md5"));
const Helpers_1 = require("../common/Helpers");
const prisma_1 = __importDefault(require("../../prisma"));
const __1 = require("..");
const emailValidation_1 = require("../services/emailValidation");
const authValidations_1 = require("../validations/authValidations");
const s3Config_1 = require("../common/s3Config");
const login = async (req, res) => {
    try {
        let errors = Helpers_1.Helpers.validate(authValidations_1.VLoginRequest, req.body);
        if (errors.length) {
            return Helpers_1.Helpers.errorResponse(400, res, "Validation Errors", errors);
        }
        const { username, password } = req.body;
        const employeeLogin = await prisma_1.default.loginDetails.findFirst({
            where: {
                username: username
            }
        });
        const hashedPassword = (0, md5_1.default)(password);
        if (!employeeLogin || employeeLogin.password !== hashedPassword) {
            return Helpers_1.Helpers.errorResponse(403, res, "Incorrect Credentials");
        }
        const employeeRoleObj = await prisma_1.default.employeeDetailRole.findFirst({
            where: {
                employeeDetailsId: employeeLogin.id
            }
        });
        const employee = await prisma_1.default.employeeDetails.findFirst({
            where: {
                id: employeeLogin.id
            }
        });
        // generate token
        const token = jsonwebtoken_1.default.sign({ userId: employeeLogin.id, userRole: employeeRoleObj === null || employeeRoleObj === void 0 ? void 0 : employeeRoleObj.masterRoleId }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const profilePhoto = await (0, s3Config_1.getSignedUrlByPath)(`user/${employee === null || employee === void 0 ? void 0 : employee.photo}`);
        return Helpers_1.Helpers.successResponse(200, { token, username, userRole: employeeRoleObj === null || employeeRoleObj === void 0 ? void 0 : employeeRoleObj.masterRoleId, firstName: employee === null || employee === void 0 ? void 0 : employee.firstName, middleName: employee === null || employee === void 0 ? void 0 : employee.middleName, lastName: employee === null || employee === void 0 ? void 0 : employee.lastName, email: employee === null || employee === void 0 ? void 0 : employee.companyEmail, profilePhoto }, res);
    }
    catch (err) {
        console.error('Login error:', err);
        return Helpers_1.Helpers.errorResponse(500, res, "Login Failed");
    }
};
exports.login = login;
const forgotPassword = async (req, res) => {
    try {
        let errors = Helpers_1.Helpers.validate(authValidations_1.VForgotPassword, req.body);
        if (errors.length) {
            return Helpers_1.Helpers.errorResponse(400, res, "Validation Errors", errors);
        }
        const { email } = req.body;
        const validEmail = (0, emailValidation_1.emailValidator)(email);
        if (!validEmail) {
            return Helpers_1.Helpers.errorResponse(404, res, "Please pass correct email");
        }
        ;
        const employee = await prisma_1.default.employeeDetails.findFirst({
            where: {
                companyEmail: email
            },
            select: {
                companyEmail: true,
            }
        });
        if (!employee) {
            return Helpers_1.Helpers.errorResponse(404, res, "User does not Exist");
        }
        const otp = Math.floor(10000 + Math.random() * 90000);
        __1.optCache.set(email, otp.toString(), 300);
        let mailDetails = {
            from: 'emsinfogen@gmail.com',
            to: email,
            subject: "Your OTP for password reset by EMS",
            text: otp.toString()
        };
        await __1.transporter.sendMail(mailDetails)
            .then((info) => {
            Helpers_1.Helpers.successResponse(200, {}, res, "Mail Sent Successfully");
        })
            .catch((error) => {
            console.log(error);
            Helpers_1.Helpers.errorResponse(400, res, "Cannot send Mail");
        });
    }
    catch (err) {
        console.error('forgotPassword error:', err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.forgotPassword = forgotPassword;
const verifyOTP = async (req, res) => {
    try {
        let errors = Helpers_1.Helpers.validate(authValidations_1.VVerifyOTP, req.body);
        if (errors.length) {
            return Helpers_1.Helpers.errorResponse(400, res, "Validation Errors", errors);
        }
        const { otp, email } = req.body;
        const validEmail = (0, emailValidation_1.emailValidator)(email);
        if (!validEmail) {
            return Helpers_1.Helpers.errorResponse(404, res, "Please pass correct email");
        }
        ;
        if (!otp)
            return Helpers_1.Helpers.errorResponse(403, res, "OTP is Required");
        const storedOTP = __1.optCache.get(email);
        if (storedOTP == otp) {
            // optCache.del(email);
            const employee = await prisma_1.default.employeeDetails.findFirst({
                where: {
                    companyEmail: email
                },
                select: {
                    id: true,
                }
            });
            const employeeRoleObj = await prisma_1.default.employeeDetailRole.findFirst({
                where: {
                    employeeDetailsId: employee === null || employee === void 0 ? void 0 : employee.id
                },
                select: {
                    masterRoleId: true,
                }
            });
            const token = jsonwebtoken_1.default.sign({ userId: employee === null || employee === void 0 ? void 0 : employee.id, userRole: employeeRoleObj === null || employeeRoleObj === void 0 ? void 0 : employeeRoleObj.masterRoleId }, process.env.JWT_SECRET, { expiresIn: '1h' });
            return Helpers_1.Helpers.successResponse(200, { token }, res, "OTP Validated");
        }
        else {
            return Helpers_1.Helpers.errorResponse(403, res, "OTP is Incorrect");
        }
    }
    catch (err) {
        console.error('verifyOTP error:', err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.verifyOTP = verifyOTP;
const resetPassword = async (req, res) => {
    try {
        let errors = Helpers_1.Helpers.validate(authValidations_1.VResetPassword, req.body);
        if (errors.length) {
            return Helpers_1.Helpers.errorResponse(400, res, "Validation Errors", errors);
        }
        const { newPassword } = req.body;
        const { userId, userRole } = req.body.user;
        if (!newPassword)
            Helpers_1.Helpers.errorResponse(400, res, "Password is Required");
        const updatePassword = await prisma_1.default.loginDetails.update({
            where: {
                id: userId
            },
            data: {
                password: (0, md5_1.default)(newPassword)
            }
        });
        return Helpers_1.Helpers.successResponse(200, {}, res, "Password Reset Successfully");
    }
    catch (err) {
        console.error('resetPassword error:', err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.resetPassword = resetPassword;
