"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const dashboardController_1 = require("../controllers/dashboardController");
const router = express_1.default.Router();
router.get('/dashboard/dailylog', authMiddleware_1.authenticateUser, dashboardController_1.dailyLog);
router.get('/dashboard/weeklyTasks', authMiddleware_1.authenticateUser, dashboardController_1.weeklyTasks);
router.get('/dashboard/monthOverview', authMiddleware_1.authenticateUser, dashboardController_1.monthOverview);
router.get('/dashboard/calendar', authMiddleware_1.authenticateUser, dashboardController_1.calendarOverview);
router.get('/dashboard/managerTasks', authMiddleware_1.authenticateUser, dashboardController_1.managerTasksToday);
exports.default = router;
