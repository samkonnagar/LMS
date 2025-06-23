import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    name: { type: String, unique: true, trim: true },
  },
  { timestamps: true }
);

export default model("Category", categorySchema);
