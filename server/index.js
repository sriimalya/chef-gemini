import express from "express";
import { corsMiddleware } from './middleware/corsMiddleware.js';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser'

import "./config/db.js";

import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import recipeRoute from './routes/recipe.js'
import bookmarkRoutes from './routes/bookmark.js'

dotenv.config();
const app = express();
app.set('trust proxy', 1);
app.use(corsMiddleware);

app.use(express.json());
app.use(cookieParser());


const PORT = process.env.PORT || 5000;

app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

app.use('/auth', authRoutes);
app.use('/user', userRoutes)
app.use('/get-recipe', recipeRoute);
app.use('/bookmark', bookmarkRoutes)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
