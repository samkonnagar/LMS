import { Schema, model } from "mongoose";

const courseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, required: true, trim: true },
    thumbnail: { type: String, required: true },
    instructor: { type: Schema.Types.ObjectId, ref: "User" },
    category: { type: Schema.Types.ObjectId, ref: "Category" },
    tags: [String],
  },
  { timestamps: true }
);

export default model("Course", courseSchema);
