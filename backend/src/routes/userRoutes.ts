import express from "express";
import { createUser, deleteUser, getuser, getUsers, updateUsers } from "../controllers/userController";
import { validate } from "../middleware/validate";
import { createUserSchema } from "../middleware/validation/userValidation"

const router = express.Router()

router.post('/', validate(createUserSchema), createUser)
router.get('/all', getUsers)
router.get('/:id', getuser)
router.put('/:id', updateUsers)
router.delete('/:id', deleteUser)

export default router