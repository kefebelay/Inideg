"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const validate_1 = require("../middleware/validate");
const userValidation_1 = require("../middleware/validation/userValidation");
const authorizeRoles_1 = require("../middleware/auth/authorizeRoles");
const auth_1 = require("../middleware/auth/auth");
const multer_1 = __importDefault(require("../middleware/multer"));
const router = express_1.default.Router();
router.post("/", multer_1.default.single("profile"), (0, validate_1.validate)(userValidation_1.createUserSchema), userController_1.createUser);
router.get("/all", auth_1.requireAuth, (0, authorizeRoles_1.authorizeRoles)("admin"), userController_1.getUsers);
router.get("/:id", userController_1.getuser);
router.put("/:id", multer_1.default.single("profile"), userController_1.updateUser);
router.delete("/:id", userController_1.deleteUser);
exports.default = router;
