import express from 'express'
import verifyToken from '../middleware/authMiddleware.js'
import { getRecipe, getRecipeById } from '../controllers/recipeController.js'
import { recipeRateLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.post("/", verifyToken, recipeRateLimiter, getRecipe);
router.get("/:recipeId", verifyToken, getRecipeById);

export default router;