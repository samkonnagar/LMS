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
  lesson.pdfUrl
    ? (lesson.pdfUrl = `${process.env.BASE_URL}/lesson/${lesson.pdfUrl}`)
    : (lesson.pdfUrl = null);

  return res
    .status(201)
    .json(new ApiResponse(201, { lesson }, "Lesson Created Successfully"));
};

const handleEditLesson = async (req, res) => {
  const id = req.params?.lessonId;
  if (!id) throw new ApiError(400, "Lesson Id is required");
  // check if lesson exist
  const lesson = await LessonModel.findById(id);
  if (!lesson) throw new ApiError(409, "Invalid Lesson Id");
  // check if user is instructor of course
  const course = await CourseModel.findOne({
    _id: lesson.course,
    instructor: new mongoose.Types.ObjectId(req.user?._id),
  });
  if (!course)
    throw new ApiError(403, "You are not authorized to edit this lesson");
  // collect all data
  const { title, content } = req.body;
  // validation - not empty
  if (
    [title, content].some((field) => field?.trim() === "") ||
    !title ||
    !content
  ) {
    throw new ApiError(400, "All fields are required");
  }
  // update lesson
  lesson.title = title.trim();
  lesson.content = content.trim();
  // check for video
  if (req.files?.video && req.files.video.length > 0) {
    // delete old video file
    if (lesson.videoUrl) deleteFile("uploads/" + lesson.videoUrl);
    // update video
    lesson.videoUrl = req.files.video[0]?.filename;
  }
  // check for pdf
  if (req.files?.pdf && req.files.pdf.length > 0) {
    // delete old pdf file
    if (lesson.pdfUrl) deleteFile("uploads/" + lesson.pdfUrl);
    // update pdf
    lesson.pdfUrl = req.files.pdf[0]?.filename;
  }
  // save lesson
  const updatedLesson = await lesson.save();
  if (!updatedLesson)
    throw new ApiError(500, "Something went wrong while updating lesson");
  updatedLesson.videoUrl = `${process.env.BASE_URL}/lesson/${updatedLesson.videoUrl}`;
  updatedLesson.pdfUr
    ? (updatedLesson.pdfUrl = `${process.env.BASE_URL}/lesson/${updatedLesson.pdfUrl}`)
    : (updatedLesson.pdfUrl = null);

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        { lesson: updatedLesson },
        "Lesson Updated Successfully"
      )
    );
};

const handleDeleteLesson = async (req, res) => {
  const id = req.params?.lessonId;
  if (!id) throw new ApiError(400, "Lesson Id is required");
  // check if lesson exist
  const lesson = await LessonModel.findById(id);

  if (!lesson) throw new ApiError(409, "Invalid Lesson Id");

  // check if user is instructor of course
  const course = await CourseModel.findOne({
    _id: lesson.course,
    instructor: new mongoose.Types.ObjectId(req.user?._id),
  });
  if (!course)
    throw new ApiError(403, "You are not authorized to delete this lesson");

  // delete video file
  if (lesson.videoUrl) deleteFile("uploads/" + lesson.videoUrl);
  // delete pdf file
  if (lesson.pdfUrl) deleteFile("uploads/" + lesson.pdfUrl);
  // delete lesson
  const deletedLesson = await LessonModel.findByIdAndDelete(id);
  if (!deletedLesson) throw new ApiError(500, "Something went wrong");

  res.status(200).json(new ApiResponse(200, {}, "Lesson Deleted Successfully"));
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
    return res
      .status(200)
      .json(new ApiResponse(200, { lessons: [] }, "No Lessons Found"));
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
