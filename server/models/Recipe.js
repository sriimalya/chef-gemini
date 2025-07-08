import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  createdAt: { type: Date, default: () => new Date().toLocaleString(), },
});

export default mongoose.model("Recipe", recipeSchema);
