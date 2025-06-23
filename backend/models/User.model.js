import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: [true, "Password is required"] },
    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model("User", userSchema);
