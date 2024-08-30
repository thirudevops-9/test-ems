"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const managerController_1 = require("../controllers/managerController");
const router = express_1.default.Router();
router.get('/employee/list', authMiddleware_1.authenticateUser, managerController_1.getManagerEmployees);
router.get('/employee/view/:id', authMiddleware_1.authenticateUser, managerController_1.viewManagerEmployee);
router.get('/employee/tasks/:id', authMiddleware_1.authenticateUser, managerController_1.viewEmployeeTasks);
exports.default = router;
