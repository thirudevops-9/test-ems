"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const profileController_1 = require("../controllers/profileController");
const router = express_1.default.Router();
router.get('/profile/view', authMiddleware_1.authenticateUser, profileController_1.profileDetails);
exports.default = router;
