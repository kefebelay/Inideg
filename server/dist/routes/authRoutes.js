"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const auth_1 = require("../middleware/auth/auth");
const router = express_1.default.Router();
router.post('/login', authController_1.login);
router.post('/logout', authController_1.logout);
router.get('/me', auth_1.requireAuth, authController_1.getLoggedinUser);
exports.default = router;
