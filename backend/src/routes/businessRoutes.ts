import express from "express";
import {
  createBusiness,
  getBusinesses,
  getBusiness,
  updateBusiness,
  deleteBusiness,
  likeBusiness,
  getMostViewedBusinesses,
  getMostLikedBusinesses,
  getMostCommentedBusinesses,
  getBusinessByCategory,
  searchBusinesses,
  getBusinessByOwner,
} from "../controllers/businessController";

const router = express.Router();
router.post("/", createBusiness);
router.get("/", getBusinesses);
router.get("/:id", getBusiness);
router.put("/:id", updateBusiness);
router.delete("/:id", deleteBusiness);
router.post("/:id/like", likeBusiness);
router.get("/most-viewed", getMostViewedBusinesses);
router.get("/most-liked", getMostLikedBusinesses);
router.get("/most-commented", getMostCommentedBusinesses);
router.get("/category/:categoryId", getBusinessByCategory);
router.get("/search", searchBusinesses);
router.get("/owner/:ownerId", getBusinessByOwner);
