"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const projectController_1 = require("../controllers/projectController");
const router = express_1.default.Router();
router.get('/projects/employeeProjects', authMiddleware_1.authenticateUser, projectController_1.getEmployeeProjects);
router.get('/projects/managerProjects', authMiddleware_1.authenticateUser, projectController_1.getManagerProjects);
router.get('/projects/:id', authMiddleware_1.authenticateUser, projectController_1.viewProject);
router.post('/projects/addMilestone', authMiddleware_1.authenticateUser, projectController_1.addMilestone);
exports.default = router;
