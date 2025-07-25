"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth/auth");
const likeController_1 = require("../controllers/likeController");
const router = express_1.default.Router();
router.post("/", auth_1.requireAuth, likeController_1.likeBusiness);
router.post("/", auth_1.requireAuth, likeController_1.getLikedBusinesses);
