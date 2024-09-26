import jwt from "jsonwebtoken";
import { z } from "zod";
import dotenv from "dotenv";
import Post from "../models/post.js";
import fs from "fs";

dotenv.config();
const secret = process.env.JWT_SECRET;

const postSchema = z.object({
  title: z.string().min(1, "Title is required"),
  summary: z.string().min(1, "Summary is required"),
  content: z.string().min(1, "Content is required"),
});

export const postControll = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const { originalname, path } = req.file;
    const filenameExt = originalname.split(".").pop();
    const newFilename = `${path}.${filenameExt}`;
    const coverPath = newFilename.replace(/\\/g, "/");

    try {
      fs.renameSync(path, coverPath);
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Error renaming the file",
        error: err.message,
      });
    }

    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication token is missing",
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Invalid authentication token",
        error: err.message,
      });
    }

    const { title, summary, content } = req.body;
    try {
      postSchema.parse({ title, summary, content });
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    const post = new Post({
      title,
      summary,
      content,
      cover: coverPath,
      author: decoded.id,
    });

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post created successfully!",
      data: {
        title,
        summary,
        content,
        cover: newFilename,
      },
    });
  } catch (error) {
    console.error("Post creation error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during post creation.",
      error: error.message,
    });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username")
      .sort({ createdAt: -1 })
      .limit(20);
    return res.status(200).json({
      success: true,
      message: "Posts fetched successfully!",
      data: posts,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching posts.",
    });
  }
};

export const getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "username"
    );
    return res.status(200).json({
      success: true,
      message: "Post fetched successfully!",
      data: post,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching post.",
    });
  }
};

export const editPost = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, summary, content } = req.body;
    const updatedData = { title, summary, content };

    if (req.file) {
      const { originalname, path } = req.file;
      const filenameext = originalname.split(".");
      const newFilename = `${path}.${filenameext[filenameext.length - 1]}`;
      const coverPath = newFilename.replace(/\\/g, "/");
      updatedData.cover = coverPath;
    }

    await Post.findOneAndUpdate({ _id: id }, updatedData);

    return res.status(200).json({
      success: true,
      message: "Post updated successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the post.",
    });
  }
};



export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }
 
    await Post.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Post deleted successfully!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the post.",
    });
  }
};
