"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const hrController_1 = require("../controllers/hrController");
const router = express_1.default.Router();
router.post('/hr/addEmployee', authMiddleware_1.authenticateUser, hrController_1.addEmployee);
router.get('/hr/employees', authMiddleware_1.authenticateUser, hrController_1.employeeOnboardingList);
router.get('/hr/managers', authMiddleware_1.authenticateUser, hrController_1.getManagerList);
exports.default = router;
