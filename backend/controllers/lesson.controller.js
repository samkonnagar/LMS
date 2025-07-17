import mongoose from "mongoose";
import CourseModel from "../models/Course.model.js";
import LessonModel from "../models/Lesson.model.js";
import { ApiError } from "../utils/ApiError.js";
import { deleteFile } from "../utils/upload.utils.js";

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

  const _id = req.params?.id;

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
  const pdf = req.files?.pdf[0]?.filename;

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
  res.json({ message: "Feature not added Yet!" });
};

export {
  handleAddLessonCourse,
  handleEditLesson,
  handleDeleteLesson,
  handleGetAllLessons,
};
