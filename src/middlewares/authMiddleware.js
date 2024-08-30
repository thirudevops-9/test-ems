"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateUser = void 0;
const Helpers_1 = require("../common/Helpers");
const authenticateUser = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return Helpers_1.Helpers.errorResponse(401, res, "Authorization header missing");
        }
        const token = authHeader;
        const decoded = Helpers_1.Helpers.verifyToken(token);
        if (decoded) {
            req.body.user = decoded;
            next();
        }
        else {
            return Helpers_1.Helpers.errorResponse(400, res, "Invalid or Expired Token");
        }
    }
    catch (err) {
        console.log("Auth Midllware", err);
        return Helpers_1.Helpers.errorResponse(500, res, "Internal Server Error");
    }
};
exports.authenticateUser = authenticateUser;
