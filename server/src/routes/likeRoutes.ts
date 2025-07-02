import express from "express";
import { requireAuth } from "../middleware/auth/auth";
import {
  getLikedBusinesses,
  likeBusiness,
} from "../controllers/likeController";

const router = express.Router();

router.post("/", requireAuth, likeBusiness);
router.post("/", requireAuth, getLikedBusinesses);
