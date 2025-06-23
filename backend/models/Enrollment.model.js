import { Schema, model } from "mongoose";

const enrollmentSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "User" },
    course: { type: Schema.Types.ObjectId, ref: "Course" },
    completedLessons: [{ type: Schema.Types.ObjectId, ref: "Lesson" }],
  },
  { timestamps: true }
);

export default model("Enrollment", enrollmentSchema);
