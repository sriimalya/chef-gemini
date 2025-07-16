import mongoose, { mongo } from "mongoose";

const  bookmarkSchema = new mongoose.Schema({
    user: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    recipe: {type: mongoose.Schema.Types.ObjectId, ref: "Recipe", required: true},
    createdAt: {type: Date, default: Date.now}
});

export default mongoose.model("Bookmark", bookmarkSchema);
