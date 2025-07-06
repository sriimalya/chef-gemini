import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/db.js";
import cookieParser from 'cookie-parser'
import { authLimiter } from './middleware/rateLimiters.js';

import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import recipeRoute from './routes/recipe.js'

const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

dotenv.config();

const PORT = process.env.PORT || 5000;

app.use('/auth', authLimiter, authRoutes);
app.use('/user', userRoutes)
app.use('/', recipeRoute);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
