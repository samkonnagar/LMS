import UserModel from "../models/User.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerNewUser = async (req, res) => {
  const { fullName, email, role, password } = req.body;

  // validation - not empty
  if (
    [fullName, email, role, password].some((field) => field?.trim() === "") ||
    !fullName ||
    !email ||
    !role ||
    !password
  ) {
    throw new ApiError(400, "All filds are required");
  }

  // check if user already exist - username and email
  const existedUser = await UserModel.findOne({
    email,
  });

  if (existedUser) {
    throw new ApiError(409, "email already exist");
  }

  // create user object - create entry in db
  const user = await UserModel.create({
    name: fullName.trim(),
    email,
    password,
    role,
  });

  // remove password from response
  const createdUser = await UserModel.findById(user._id).select("-password -__v");

  // check for user creation
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registerimg the user");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, { createdUser }, "User Created Successfully"));
};

const handleLoginUser = async (req, res) => {
  res.json({ message: "Feature not added Yet!" });
};

const handleGetUserData = async (req, res) => {
  res.json({ message: "Feature not added Yet!" });
};

const handleUpdateUserData = async (req, res) => {
  res.json({ message: "Feature not added Yet!" });
};

const handleGetAllUserData = async (req, res) => {
  res.json({ message: "Feature not added Yet!" });
};

const handleBlockSelectedUser = async (req, res) => {
  res.json({ message: "Feature not added Yet!" });
};

const handleUnblockSelectedUser = async (req, res) => {
  res.json({ message: "Feature not added Yet!" });
};

export {
  registerNewUser,
  handleLoginUser,
  handleGetUserData,
  handleUpdateUserData,
  handleGetAllUserData,
  handleBlockSelectedUser,
  handleUnblockSelectedUser,
};
