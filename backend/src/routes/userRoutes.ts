import express from "express";
import { createUser } from "../controllers/userController";
import { validate } from "../middleware/validate";
import { createUserSchema } from "../middleware/validation/userValidation"

const router = express.Router()

router.post('/', validate(createUserSchema), createUser)

export default router