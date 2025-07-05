import express from "express";
import {
  createBusiness,
  getBusinesses,
  getBusiness,
  deleteBusiness,
  getMostViewedBusinesses,
  getMostLikedBusinesses,
  getMostCommentedBusinesses,
  getBusinessByCategory,
  searchBusinesses,
  getBusinessByOwner,
  toggleBusinessLike,
  getBusinessesUserLikes,
} from "../controllers/businessController";
import { upload } from "../middleware/multerDisk";

const router = express.Router();
router.post("/", upload.array("profile", 5), createBusiness);
router.get("/", getBusinesses);
router.get("/:id", getBusiness);
router.delete("/:id", deleteBusiness);
router.get("/most-viewed", getMostViewedBusinesses);
router.get("/most-liked", getMostLikedBusinesses);
router.get("/liked", getBusinessesUserLikes);
router.get("/toggle-like", toggleBusinessLike);
router.get("/most-commented", getMostCommentedBusinesses);
router.get("/category/:categoryId", getBusinessByCategory);
router.get("/search", searchBusinesses);
router.get("/owner/:ownerId", getBusinessByOwner);
export default router;
