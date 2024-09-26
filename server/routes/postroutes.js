import express from "express";
import multer from "multer";
import { postControll, getPosts, getSinglePost, editPost, deletePost } from "../controllers/postController.js";

const postRouter = express.Router();
const upload = multer({ dest: "uploads/" });

postRouter.post("/posts", upload.single("files"), postControll);
postRouter.get("/get", getPosts);
postRouter.get("/post/:id", getSinglePost);
postRouter.put("/edit/:id", upload.single("files"), editPost);
postRouter.delete("/delete/:id", deletePost);


export default postRouter;
