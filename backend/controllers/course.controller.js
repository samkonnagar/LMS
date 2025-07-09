import CategoryModal from "../models/Category.model.js";
import CourseModal from "../models/Course.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { deleteFile } from "../utils/upload.utils.js";

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
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        courses,
      },
      "Successfull"
    )
  );
};

const handleGetFilterCourses = async (req, res) => {
  res.json({ message: "Feature not added Yet!" });
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
    throw new ApiError(400, "All filds are required");
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

  return res
    .status(201)
    .json(new ApiResponse(201, { course }, "Course Created Successfully"));
};

const handleGetCourseDetails = async (req, res) => {
  res.json({ message: "Feature not added Yet!" });
};

const handleUpdateCourseDetails = async (req, res) => {
  res.json({ message: "Feature not added Yet!" });
};

const handleDeleteCourseDetails = async (req, res) => {
  res.json({ message: "Feature not added Yet!" });
};

export {
  handleGetAllCourses,
  handleGetFilterCourses,
  handleCreateNewCourse,
  handleGetCourseDetails,
  handleUpdateCourseDetails,
  handleDeleteCourseDetails,
};
