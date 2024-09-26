import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRoute.js";
import postRouter from "./routes/postroutes.js";
import { fileURLToPath } from "url";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
mongoose
  .connect(
    "mongodb+srv://koushikgdatta5:datta%400217@cluster0.ntazs.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization", "Cache-Control"],
    credentials: true,
  })
);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
