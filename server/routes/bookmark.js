// post : add to bookmark

// get: show bookmark on page

// delete: remove bookmark

import express from "express";
import {addBookmark, getBookmarks, removeBookmark} from "../controllers/bookmarkController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// add to bookmark
router.post("/:recipeId", verifyToken, addBookmark);

// get bookmarks
router.get("/", verifyToken, getBookmarks);

// remove bookmark
router.delete("/:recipeId", verifyToken, removeBookmark);

export default router;

