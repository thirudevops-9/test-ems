"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const masterController_1 = require("../controllers/masterController");
const buHeadController_1 = require("../controllers/buHeadController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const projectController_1 = require("../controllers/projectController");
const router = express_1.default.Router();
router.get('/master/designations', masterController_1.masterDesignations);
router.get('/master/roles', masterController_1.masterRoles);
router.get('/master/businessUnits', buHeadController_1.getMasterBusinessUnits);
router.get('/master/projects', authMiddleware_1.authenticateUser, projectController_1.getAllProjects);
exports.default = router;
