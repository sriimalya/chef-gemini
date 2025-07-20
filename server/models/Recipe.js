import mongoose from "mongoose";

const recipeSchema = new mongoose.Schema({
  content: { type: String, required: true },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

recipeSchema.index({ createdBy: 1 });

export default mongoose.model("Recipe", recipeSchema);