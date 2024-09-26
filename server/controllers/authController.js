import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();
const secret = process.env.JWT_SECRET;

const registerSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(15, "Username too long"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const registerUser = async (req, res) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { username, email, password } = validatedData;

    const existingEmail = await User.findOne({ email });
    const existingUsername = await User.findOne({ username });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is already registered! Please log in.",
      });
    }

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: "Username is already taken! Please choose a different one.",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      username,
      email,
      password: hashPassword,
    });

    await newUser.save();

    return res.status(200).json({
      success: true,
      message: "Registration successful",
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during registration.",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { email, password } = validatedData;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User does not exist! Please register first.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect password! Please try again.",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        username: user.username,
      },
      secret,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      sameSite: "Strict",
      maxAge: 3600000,
    });

    return res.json({
      success: true,
      message: "Logged in successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    console.error(error);
    return res.status(500).json({
      success: false,
      message: "An error occurred during login.",
    });
  }
};

export const getProfile = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "No token found" });
    }

    const decoded = jwt.verify(token, secret);

    const user = await User.findById(decoded.id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    return res.json({
      success: true,
      message: "Profile fetched successfully",
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token");
    return res.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
