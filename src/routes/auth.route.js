"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = express_1.default.Router();
router.post('/login', authController_1.login);
router.post('/forgotPass', authController_1.forgotPassword);
router.post('/verifyOtp', authController_1.verifyOTP);
router.post('/resetPass', authMiddleware_1.authenticateUser, authController_1.resetPassword);
exports.default = router;
