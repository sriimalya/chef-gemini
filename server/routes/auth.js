import express from "express";
import {signup, login, logout, refreshToken} from '../controllers/authController.js'
import { authLimiter } from '../middleware/rateLimiters.js';


const router = express.Router();

router.post("/signup", authLimiter, signup);
router.post("/login", authLimiter, login);
router.post("/logout", authLimiter, logout)
router.post("/refresh-token", refreshToken);

export default router;
