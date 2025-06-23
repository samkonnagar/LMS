import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

export default model("Review", reviewSchema);
