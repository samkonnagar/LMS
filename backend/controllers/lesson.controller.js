import mongoose from "mongoose";
import CourseModel from "../models/Course.model.js";
import LessonModel from "../models/Lesson.model.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteFile } from "../utils/upload.utils.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const handleAddLessonCourse = async (req, res) => {
  const { title, content } = req.body;
  if (!req.files?.video) {
    throw new ApiError(400, "Video is required");
  }

  // check for video
  const videoPath = req.files.video[0]?.path;

  // validation - not empty
  if (
    [title, content].some((field) => field?.trim() === "") ||
    !title ||
    !content
  ) {
    deleteFile(videoPath);
    throw new ApiError(400, "All fields are required");
  }

  const _id = req.params?.courseId;

  // check if course exist
  const existedCourse = await CourseModel.findOne({
    _id: new mongoose.Types.ObjectId(_id),
    instructor: new mongoose.Types.ObjectId(req.user?._id),
  });


  if (!existedCourse) {
    deleteFile(videoPath);
    throw new ApiError(400, "Invalid Course Id");
  }

  // collect all data
  const video = req.files.video[0]?.filename;
  let pdf = null;
  if (req.files?.pdf && req.files.pdf.length > 0) {
    pdf = req.files?.pdf[0]?.filename;
  }

  // create lesson
  const lesson = await LessonModel.create({
    course: new mongoose.Types.ObjectId(_id),
    title: title.trim(),
    content: content.trim(),
    videoUrl: video,
    pdfUrl: pdf,
  });

  if (!lesson) {
    deleteFile(videoPath);
    throw new ApiError(500, "Something went wrong while creating category");
  }

  lesson.videoUrl = `${process.env.BASE_URL}/lesson/${lesson.videoUrl}`;
  lesson.pdfUrl = `${process.env.BASE_URL}/lesson/${lesson.pdfUrl}`;

  return res
    .status(201)
    .json(new ApiResponse(201, { lesson }, "Lesson Created Successfully"));
};

const handleEditLesson = async (req, res) => {
  res.json({ message: "Feature not added Yet!" });
};

const handleDeleteLesson = async (req, res) => {
  res.json({ message: "Feature not added Yet!" });
};

const handleGetAllLessons = async (req, res) => {
  const id = req.params?.courseId;

  if (!id) {
    throw new ApiError(400, "Course Id is required");
  }

  // check if course exist
  const course = await CourseModel.findById(id);

  if (!course) {
    throw new ApiError(409, "Invalid Course Id");
  }

  const lessons = await LessonModel.find({
    course: new mongoose.Types.ObjectId(id),
  }).sort({ createdAt: 1 });

  if (!lessons || lessons.length === 0) {
    return res.status(200).json(new ApiResponse(200, { lessons: [] }, "No Lessons Found"));
  }

  const updatedLessons = lessons.map((lesson) => ({
    ...lesson._doc,
    videoUrl: `${process.env.BASE_URL}/lesson/${lesson.videoUrl}`,
    pdfUrl: lesson.pdfUrl
      ? `${process.env.BASE_URL}/lesson/${lesson.pdfUrl}`
      : null,
  }));

  return res
    .status(200)
    .json(new ApiResponse(200, { lessons: updatedLessons }, "Success"));
};

export {
  handleAddLessonCourse,
  handleEditLesson,
  handleDeleteLesson,
  handleGetAllLessons,
};
