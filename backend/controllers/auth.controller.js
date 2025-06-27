import { ApiResponse } from "../utils/ApiResponse.js";

const registerNewUser = async (req, res) => {
  res.json(new ApiResponse(201, {}, "User Created Successfully"));
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
