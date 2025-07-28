import { Schema, model } from "mongoose";

const lessonSchema = new Schema(
  {
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true, trim: true },
    pdfUrl: { type: String, trim: true },
  },
  { timestamps: true }
);

export default model("Lesson", lessonSchema);
