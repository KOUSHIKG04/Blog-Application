import mongoose from "mongoose";


const postSchema = new mongoose.Schema(
  {
    title: String,
    summary: String,
    content: String,
    cover : String,
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  {
    timestamps: true,
  }
);

const Post = new mongoose.model("Post", postSchema);
export default Post;
