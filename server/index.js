import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from 'cookie-parser'

import "./config/db.js";

import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import recipeRoute from './routes/recipe.js'

dotenv.config();
const app = express();

app.use(cors({
    origin: ['http://localhost:5173', 'https://chef-gemini-iota.vercel.app'],
    credentials: true
}));

app.options("*", cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());


const PORT = process.env.PORT || 5000;

app.use('/auth', authRoutes);
app.use('/user', userRoutes)
app.use('/', recipeRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
