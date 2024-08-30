"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Helpers = exports.indiaTimeZone = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const moment_timezone_1 = __importDefault(require("moment-timezone"));
exports.indiaTimeZone = 'Asia/Kolkata';
class Helpers {
    static successResponse(statusCode, payload, res, message = "Data Found Successfully") {
        try {
            console.log("successResponse");
            const responseData = {
                success: true,
                statusCode,
                message,
                payload,
            };
            res.status(statusCode).send(Object.assign(responseData));
        }
        catch (err) {
            console.log(err);
        }
    }
    static errorResponse(statusCode, res, message = "", payload = {}) {
        try {
            console.log("errorResponse");
            const responseData = {
                success: false,
                statusCode,
                payload,
                message
            };
            res.status(statusCode).send(Object.assign(responseData));
        }
        catch (err) {
            console.log(err);
        }
    }
    static getTodayStartEnd() {
        const startOfDay = (0, moment_timezone_1.default)().tz(exports.indiaTimeZone).startOf('day');
        const endOfDay = (0, moment_timezone_1.default)().tz(exports.indiaTimeZone).endOf('day');
        const startOfDayUTC = startOfDay.utc().toDate();
        const endOfDayUTC = endOfDay.utc().toDate();
        return { startOfDayUTC, endOfDayUTC };
    }
    static getThisWeekStartEnd() {
        const startOfWeek = (0, moment_timezone_1.default)().tz(exports.indiaTimeZone).startOf('week');
        const endOfWeek = (0, moment_timezone_1.default)().tz(exports.indiaTimeZone).endOf('week');
        const startOfWeekUTC = startOfWeek.utc().toDate();
        const endOfWeekUTC = endOfWeek.utc().toDate();
        return { startOfWeekUTC, endOfWeekUTC };
    }
    static getMonthStartEnd(month, year) {
        let startOfMonth;
        if (month && year) {
            startOfMonth = (0, moment_timezone_1.default)().tz(exports.indiaTimeZone).year(year).month(month - 1).startOf('month');
        }
        else if (month) {
            startOfMonth = (0, moment_timezone_1.default)().tz(exports.indiaTimeZone).month(month - 1).startOf('month');
        }
        else {
            startOfMonth = (0, moment_timezone_1.default)().tz(exports.indiaTimeZone).startOf('month');
        }
        const endOfMonth = (0, moment_timezone_1.default)(startOfMonth).endOf('month');
        const startOfMonthUTC = startOfMonth.utc().toDate();
        const endOfMonthUTC = endOfMonth.utc().toDate();
        return { startOfMonthUTC, endOfMonthUTC };
    }
    static validate(schema, requestObject) {
        const { error } = schema.validate(requestObject);
        let errors = [];
        if (error && (error === null || error === void 0 ? void 0 : error.details)) {
            for (let errorObject of error.details) {
                const { path, type, context } = errorObject, error = __rest(errorObject, ["path", "type", "context"]);
                errors.push(error);
            }
        }
        return errors;
    }
}
exports.Helpers = Helpers;
Helpers.verifyToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        return decoded;
    }
    catch (error) {
        console.error("Token verification error:", error);
        return false;
    }
};
