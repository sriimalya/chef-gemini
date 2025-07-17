import Bookmark from "../models/Bookmark.js";

export const addBookmark = async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.userId;

  try {
    const existing = await Bookmark.findOne({ user: userId, recipe: recipeId });
    if (existing) {
      return res.status(409).json({ message: "Already bookmarked" });
    }

    const bookmark = await Bookmark.create({ user: userId, recipe: recipeId });
    res.status(201).json(bookmark);
  } catch (err) {
    console.error("[Bookmark] POST error:", err);
    res.status(500).json({ error: "Failed to bookmark" });
  }
};

export const getBookmarks = async (req, res) => {
  const userId = req.userId;

  try {
    const bookmarks = await Bookmark.find({ user: userId }).populate("recipe");
    res.json(bookmarks);
  } catch (err) {
    console.error("[Bookmark] GET error:", err);
    res.status(500).json({ error: "Failed to fetch bookmarks" });
  }
};

export const removeBookmark = async (req, res) => {
  const { recipeId } = req.params;
  const userId = req.userId;

  try {
    const deleted = await Bookmark.findOneAndDelete({ user: userId, recipe: recipeId });
    if (!deleted) {
      return res.status(404).json({ message: "Bookmark not found" });
    }
    res.json({ message: "Bookmark removed" });
  } catch (err) {
    console.error("[Bookmark] DELETE error:", err);
    res.status(500).json({ error: "Failed to remove bookmark" });
  }
};
