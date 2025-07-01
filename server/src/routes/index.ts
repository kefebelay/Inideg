import { Router, Request, Response } from "express";
import userRoutes from "./userRoutes";
import authRoutes from "./authRoutes";
import categoryRoutes from "./categoryRoutes";

const router = Router();

router.use("/user", userRoutes);
router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);

export default router;
