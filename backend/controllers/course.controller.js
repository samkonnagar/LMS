import mongoose from "mongoose";
import CategoryModal from "../models/Category.model.js";
import CourseModal from "../models/Course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteFile } from "../utils/upload.utils.js";
import LessonModel from "../models/Lesson.model.js";
import EnrollmentModel from "../models/Enrollment.model.js";
import ReviewModel from "../models/Review.model.js";
import NotificationModel from "../models/Notification.model.js";

const handleGetAllCourses = async (req, res) => {
  let skip = 0;
  let limit = 20;
  if (req.query?.page) {
    const getNum = Number(req.query.page);
    if (isNaN(getNum) || getNum < 1) {
      throw new ApiError(400, "Invalid Datatype");
    }
    skip = (getNum - 1) * limit;
  }
  const courses = await CourseModal.aggregate([
    {
      $lookup: {
        from: "users",
        localField: "instructor",
        foreignField: "_id",
        as: "instructor",
      },
    },
    {
      $unwind: "$instructor",
    },
    {
      $match: {
        "instructor.isBlocked": false,
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $project: {
        __v: 0,
        "instructor.__v": 0,
        "instructor.password": 0,
        "instructor.email": 0,
        "instructor.role": 0,
        "instructor.isBlocked": 0,
        "category.__v": 0,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  if (!courses) {
    throw new ApiError(500, "Something Wrong");
  }
  const u_courses = courses.map((course) => ({
    ...course,
    thumbnail: `${process.env.BASE_URL}/thumbnail/${course.thumbnail}`,
  }));
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        u_courses,
      },
      "Successfull"
    )
  );
};

const handleGetFilterCourses = async (req, res) => {
  let skip = 0;
  let limit = 20;
  const category = req.query?.category;
  const tag = req.query?.tag;
  const q = req.query?.q;
  if (req.query?.page) {
    const getNum = Number(req.query.page);
    if (isNaN(getNum) || getNum < 1) {
      throw new ApiError(400, "Invalid Datatype");
    }
    skip = (getNum - 1) * limit;
  }

  const matchStage = {};

  if (tag) {
    matchStage.tags = tag;
  }

  if (q) {
    matchStage.$or = [
      { title: { $regex: q, $options: "i" } },
      { description: { $regex: q, $options: "i" } },
    ];
  }

  const results = await CourseModal.aggregate([
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
    {
      $match: {
        ...matchStage,
        ...(category ? { "category.name": category } : {}),
      },
    },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: "users",
        localField: "instructor",
        foreignField: "_id",
        as: "instructor",
      },
    },
    { $unwind: "$instructor" },
    {
      $match: {
        "instructor.isBlocked": false,
      },
    },
    {
      $project: {
        __v: 0,
        "instructor.__v": 0,
        "instructor.password": 0,
        "instructor.email": 0,
        "instructor.role": 0,
        "instructor.isBlocked": 0,
        "category.__v": 0,
      },
    },
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ]);

  if (!results) {
    throw new ApiError(500, "Something Wrong");
  }
  const u_results = results.map((course) => ({
    ...course,
    thumbnail: `${process.env.BASE_URL}/thumbnail/${course.thumbnail}`,
  }));

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        u_results,
      },
      "Successfull"
    )
  );
};

const handleCreateNewCourse = async (req, res) => {
  const { title, description, category, getTags } = req.body;

  // check for image
  const thumbnailPath = req.file?.path;

  // validation - not empty
  if (
    [title, description, category].some((field) => field?.trim() === "") ||
    !title ||
    !description ||
    !category
  ) {
    deleteFile(thumbnailPath);
    throw new ApiError(400, "All fields are required");
  }

  // check if user category name exist
  const existedCategory = await CategoryModal.findOne({
    name: category,
  });

  if (!existedCategory) {
    deleteFile(thumbnailPath);
    throw new ApiError(409, "Invalid Category Name");
  }

  // collect all data
  const thumbnailName = req.file?.filename;
  const categoryId = existedCategory._id;
  const userId = req.user._id;
  const tags =
    getTags.trim() === "" ? [] : getTags.split(",").map((data) => data.trim());

  // create course
  const course = await CourseModal.create({
    title: title.trim(),
    description: description.trim(),
    thumbnail: thumbnailName,
    category: categoryId,
    instructor: userId,
    tags: tags,
  });

  if (!course) {
    deleteFile(thumbnailPath);
    throw new ApiError(500, "Something went wrong while creating category");
  }

  course.thumbnail = `${process.env.BASE_URL}/thumbnail/${course.thumbnail}`;

  return res
    .status(201)
    .json(new ApiResponse(201, { course }, "Course Created Successfully"));
};

const handleGetCourseDetails = async (req, res) => {
  const id = req.params?.id;

  const course = await CourseModal.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "instructor",
        foreignField: "_id",
        as: "instructor",
      },
    },
    {
      $unwind: "$instructor",
    },
    {
      $match: {
        "instructor.isBlocked": false,
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "category",
      },
    },
    {
      $unwind: "$category",
    },
    {
      $project: {
        __v: 0,
        "instructor.__v": 0,
        "instructor.password": 0,
        "instructor.email": 0,
        "instructor.role": 0,
        "instructor.isBlocked": 0,
        "category.__v": 0,
      },
    },
  ]);

  if (!course) {
    throw new ApiError(409, "Invalid Course Id");
  }

  const u_course = course.map((course) => ({
    ...course,
    thumbnail: `${process.env.BASE_URL}/thumbnail/${course.thumbnail}`,
  }));

  // this controller not complted yet!
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        course: u_course[0] || {},
      },
      "Success"
    )
  );
};

const handleUpdateCourseDetails = async (req, res) => {
  const { title, description, category } = req.body;

  const user_id = req.user?._id;
  const course_id = req.params?.id;
  if (!title || !description || !category) {
    throw new ApiError(400, "all fields are required");
  }

  const f_category = await CategoryModal.findOne({
    name: category,
  });

  if (!f_category) {
    throw new ApiError(400, "Invalid Category");
  }

  const course = await CourseModal.findOne({
    _id: new mongoose.Types.ObjectId(course_id),
    instructor: new mongoose.Types.ObjectId(user_id),
  });

  if (!course) {
    throw new ApiError(400, "Invalid Request");
  }

  const u_course = await CourseModal.findByIdAndUpdate(
    course._id,
    {
      $set: {
        title,
        description,
        category: new mongoose.Types.ObjectId(f_category._id),
      },
    },
    { new: true }
  )
    .select("-__v")
    .populate("category");

  u_course.thumbnail = `${process.env.BASE_URL}/thumbnail/${u_course.thumbnail}`;

  return res
    .status(200)
    .json(new ApiResponse(200, u_course, "Account updated successfully"));
};

const handleDeleteCourseDetails = async (req, res) => {
  const _id = req.params?.id;
  // not done yet
  let course = null;
  if (req.user?.role === "admin") {
    course = await CourseModal.findByIdAndDelete(_id);
  } else {
    course = await CourseModal.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(_id),
      instructor: new mongoose.Types.ObjectId(req.user?._id),
    });
  }
  if (!course) {
    throw new ApiError(400, "Invalid Id");
  }
  deleteFile(`./uploads/thumbnails/${course.thumbnail}`);

  // delete all lessons of this course along with files
  const lessons = await LessonModel.find({
    course: new mongoose.Types.ObjectId(_id),
  });
  for (const lesson of lessons) {
    if (lesson.videoUrl) deleteFile("uploads/" + lesson.videoUrl);
    if (lesson.pdfUrl) deleteFile("uploads/" + lesson.pdfUrl);
  }
  await LessonModel.deleteMany({ course: new mongoose.Types.ObjectId(_id) });
  // delete all enrollments of this course
  await EnrollmentModel.deleteMany({
    course: new mongoose.Types.ObjectId(_id),
  });
  // delete all reviews of this course
  await ReviewModel.deleteMany({ course: new mongoose.Types.ObjectId(_id) });
  // delete all notifications of this course
  await NotificationModel.deleteMany({
    course: new mongoose.Types.ObjectId(_id),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Course Deleted Successfully"));
};

export {
  handleGetAllCourses,
  handleGetFilterCourses,
  handleCreateNewCourse,
  handleGetCourseDetails,
  handleUpdateCourseDetails,
  handleDeleteCourseDetails,
};
