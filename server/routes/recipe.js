import express from 'express'
import verifyToken from '../middleware/authMiddleware.js'
import { getRecipe } from '../controllers/recipeController.js'
import { recipeRateLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.post("/get-recipe", verifyToken, recipeRateLimiter, getRecipe)

export default router;