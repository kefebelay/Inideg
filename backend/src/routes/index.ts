import { Router } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import { requireAuth } from "../middleware/auth/auth";
import { authorizeRoles } from "../middleware/auth/authorizeRoles";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);

export default router;
