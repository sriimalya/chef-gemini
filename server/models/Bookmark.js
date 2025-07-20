import mongoose from "mongoose";

const  bookmarkSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    recipe: {type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true},
    createdAt: {type: Date, default: Date.now}
});

bookmarkSchema.index({ user: 1 }); 
bookmarkSchema.index({ user: 1, recipe: 1 }, { unique: true });

export default mongoose.model("Bookmark", bookmarkSchema);
