import express from "express";
import {login, logout, getLoggedinUser} from '../controllers/authController'
import { requireAuth } from '../middleware/auth/auth';
const router = express.Router()

router.post('/login', login)
router.post('/logout', logout)
router.get('/me',requireAuth, getLoggedinUser)

