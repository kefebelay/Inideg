"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const categoryController_1 = require("../controllers/categoryController");
const multer_1 = __importDefault(require("../middleware/multer"));
const router = express_1.default.Router();
router.post("/", multer_1.default.single("image"), categoryController_1.createCategory);
router.get("/", categoryController_1.getCategories);
router.get("/:id", categoryController_1.getCategory);
router.delete("/:id", categoryController_1.deleteCategory);
exports.default = router;
