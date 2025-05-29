import express from "express";
import {
  createBusiness,
  getBusinesses,
  getBusiness,
  updateBusiness,
  deleteBusiness,
} from "../controllers/Business";

const router = express.Router();
router.post("/", createBusiness);
router.get("/", getBusinesses);
router.get("/:id", getBusiness);
router.put("/:id", updateBusiness);
router.delete("/:id", deleteBusiness);
