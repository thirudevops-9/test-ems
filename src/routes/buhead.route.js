"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const buHeadController_1 = require("../controllers/buHeadController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.get('/buhead/employee/list', authMiddleware_1.authenticateUser, buHeadController_1.BUHeadEmployeeList);
router.post('/buhead/employee/edit', authMiddleware_1.authenticateUser, buHeadController_1.editEmployee);
router.post('/buhead/editPocBench', authMiddleware_1.authenticateUser, buHeadController_1.editPocBenchEmployee);
exports.default = router;
