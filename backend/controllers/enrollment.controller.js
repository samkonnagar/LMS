import mongoose from "mongoose";
import CourseModel from "../models/Course.model.js";
import EnrollmentModel from "../models/Enrollment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const handleEnrollCourse = async (req, res) => {
  const courseId = req.params?.courseId;
  if (!courseId) throw new ApiError(400, "Course ID is required");
  const course = await CourseModel.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  const userId = req.user?._id;
  const isBlocked = req.user?.isBlocked;
  if (isBlocked)
    throw new ApiError(403, "You are blocked from enrolling in courses");

  const existingEnrollment = await EnrollmentModel.findOne({
    student: new mongoose.Types.ObjectId(userId),
    course: new mongoose.Types.ObjectId(courseId),
  });
  if (existingEnrollment)
    throw new ApiError(400, "Already enrolled in this course");

  const enrollment = await EnrollmentModel.insertOne({
    student: userId,
    course: courseId,
  });

  if (!enrollment) throw new ApiError(500, "Enrollment failed");

  res
    .status(201)
    .json(new ApiResponse(201, enrollment, "Enrolled successfully"));
};

const handleGetAllCourses = async (req, res) => {
  res.json({ message: "Feature not added Yet!" });
};

const handleGetSelectedCourseProgress = async (req, res) => {
  res.json({ message: "Feature not added Yet!" });
};

const markLessonCompleted = async (req, res) => {
  res.json({ message: "Feature not added Yet!" });
};

const handleGetPdfCertificate = async (req, res) => {
  res.json({ message: "Feature not added Yet!" });
};

export {
  handleEnrollCourse,
  handleGetAllCourses,
  handleGetSelectedCourseProgress,
  markLessonCompleted,
  handleGetPdfCertificate,
};
