"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userRoutes_1 = __importDefault(require("./userRoutes"));
const authRoutes_1 = __importDefault(require("./authRoutes"));
const categoryRoutes_1 = __importDefault(require("./categoryRoutes"));
const businessRoutes_1 = __importDefault(require("./businessRoutes"));
const router = (0, express_1.Router)();
router.use("/user", userRoutes_1.default);
router.use("/auth", authRoutes_1.default);
router.use("/category", categoryRoutes_1.default);
router.use("/business", businessRoutes_1.default);
exports.default = router;
