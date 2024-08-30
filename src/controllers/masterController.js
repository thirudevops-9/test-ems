"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.masterRoles = exports.masterDesignations = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const Helpers_1 = require("../common/Helpers");
const masterDesignations = async (req, res) => {
    try {
        const designationData = await prisma_1.default.designationMaster.findMany();
        return Helpers_1.Helpers.successResponse(200, designationData, res);
    }
    catch (err) {
        console.error('masterDesignations error:', err);
        return Helpers_1.Helpers.errorResponse(500, res, "Error occurred");
    }
};
exports.masterDesignations = masterDesignations;
const masterRoles = async (req, res) => {
    try {
        const rolesData = await prisma_1.default.masterRoles.findMany();
        return Helpers_1.Helpers.successResponse(200, rolesData, res);
    }
    catch (err) {
        console.error('masterRoles error:', err);
        return Helpers_1.Helpers.errorResponse(500, res, "Error occurred");
    }
};
exports.masterRoles = masterRoles;
