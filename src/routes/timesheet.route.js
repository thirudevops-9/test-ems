"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const timesheetController_1 = require("../controllers/timesheetController");
const router = express_1.default.Router();
router.post('/timesheet/create', authMiddleware_1.authenticateUser, timesheetController_1.createTask);
router.get('/timesheet/list', authMiddleware_1.authenticateUser, timesheetController_1.listTasks);
router.delete('/timesheet/delete', authMiddleware_1.authenticateUser, timesheetController_1.deleteTask);
router.post('/timesheet/edit', authMiddleware_1.authenticateUser, timesheetController_1.editTask);
router.get('/timesheet/managerHistory', authMiddleware_1.authenticateUser, timesheetController_1.managerTaskHistory);
router.get('/timesheet/managerReview', authMiddleware_1.authenticateUser, timesheetController_1.managerGetTaskUnderReview);
router.post('/timesheet/review', authMiddleware_1.authenticateUser, timesheetController_1.approveRejectTask);
exports.default = router;
