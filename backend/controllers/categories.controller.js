import CategoryModal from "../models/Category.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const handleGetAllCategories = async (req, res) => {
  let skip = 0;
  let limit = 20;
  if (req.query?.page) {
    const getNum = Number(req.query.page);
    if (isNaN(getNum) || getNum < 1) {
      throw new ApiError(400, "Invalid Datatype");
    }
    skip = (getNum - 1) * limit;
  }
  const categories = await CategoryModal.find({})
    .skip(skip)
    .limit(limit)
    .select("-__v");

  if (!categories) {
    throw new ApiError(500, "Something Wrong");
  }
  return res.status(200).json(
    new ApiResponse(
      200,
      {
        categories,
      },
      "Successfull"
    )
  );
};

const handleAddCategory = async (req, res) => {
  if (!req.body?.categoryName) {
    throw new ApiError(400, "Category name is required");
  }

  const { categoryName } = req.body;

  // validation - not empty
  if (categoryName.trim() === "") {
    throw new ApiError(400, "Category name can't be empty");
  }

  // check if user category name exist
  const existedCategory = await CategoryModal.findOne({
    name: categoryName,
  });

  if (existedCategory) {
    throw new ApiError(409, "Category already exist");
  }

  // create category
  const category = await CategoryModal.create({
    name: categoryName.trim(),
  });

  if (!category) {
    throw new ApiError(500, "Something went wrong while creating category");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { category }, "Category Created Successfully"));
};

const handleDeleteCategory = async (req, res) => {
  const _id = req.params?.id;
  const category = await CategoryModal.findByIdAndDelete(_id);
  if (!category) {
    throw new ApiError(400, "Invalid Id");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Category Deleted Successfully"));
};

export { handleGetAllCategories, handleAddCategory, handleDeleteCategory };
