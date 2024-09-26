import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, min: 4 },
    email: String,
    password: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const User = new mongoose.model("User", userSchema);
export default User;
