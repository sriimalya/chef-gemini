import express from "express";
import cors from 'cors';
import dotenv from "dotenv";
import cookieParser from 'cookie-parser'

import "./config/db.js";

import authRoutes from './routes/auth.js'
import userRoutes from './routes/user.js'
import recipeRoute from './routes/recipe.js'
import bookmarkRoutes from './routes/bookmark.js'

dotenv.config();
const app = express();

const allowedOrigins = [
  process.env.FRONTEND_URL_PRODUCTION,
  process.env.FRONTEND_URL_LOCAL,
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.warn(`[CORS] Blocked request from disallowed origin: ${origin}`);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.set('trust proxy', 1);
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

app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS: Origin not allowed" });
  }
  next(err);
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
