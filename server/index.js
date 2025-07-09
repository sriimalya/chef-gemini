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

const allowedOrigins = [
  "http://localhost:5173",
  "https://chef-gemini-iota.vercel.app"
];
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());
app.use(cookieParser());


const PORT = process.env.PORT || 5000;

app.use('/auth', authRoutes);
app.use('/user', userRoutes)
app.use('/get-recipe', recipeRoute);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
