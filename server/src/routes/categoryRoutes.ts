import express from "express";
import {
  createCategory,
  getCategories,
  getCategory,
  deleteCategory,
} from "../controllers/categoryController";
import upload from "../middleware/multer";

const router = express.Router();

router.post("/", upload.single("image"), createCategory);
router.get("/", getCategories);
router.get("/:id", getCategory);
router.delete("/:id", deleteCategory);

export default router;
