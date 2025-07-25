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
  getBusinessAndIncrementViews,
  verifyBusiness,
} from "../controllers/businessController";
import { upload } from "../middleware/multerDisk";

const router = express.Router();
router.post("/", upload.array("profile", 5), createBusiness);
router.get("/", getBusinesses);
router.get("/search", searchBusinesses);
router.get("/most-viewed", getMostViewedBusinesses);
router.get("/most-liked", getMostLikedBusinesses);
router.get("/:userId/liked", getBusinessesUserLikes);
router.get("/category/:categoryId", getBusinessByCategory);
router.patch("/:id/verify", verifyBusiness);
router.post("/toggle-like", toggleBusinessLike);
router.get("/owner/:ownerId", getBusinessByOwner);
router.get("/:id", getBusiness);
router.get("/:id/view", getBusinessAndIncrementViews);
router.delete("/:id", deleteBusiness);
export default router;
