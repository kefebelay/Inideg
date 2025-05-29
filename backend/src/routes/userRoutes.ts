import express from "express";
import {
  createUser,
  deleteUser,
  getuser,
  getUsers,
  updateUser,
} from "../controllers/userController";
import { validate } from "../middleware/validate";
import { createUserSchema } from "../middleware/validation/userValidation";
import { authorizeRoles } from "../middleware/auth/authorizeRoles";

const router = express.Router();

router.post("/", validate(createUserSchema), createUser);
router.get("/all", authorizeRoles("admin"), getUsers);
router.get("/:id", getuser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
