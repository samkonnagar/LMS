import { Router } from "express";
import {
  registerNewUser,
  handleLoginUser,
  handleGetUserData,
  handleUpdateUserData,
  handleGetAllUserData,
  handleBlockSelectedUser,
  handleUnblockSelectedUser,
} from "../controllers/auth.controller.js";

const router = Router();

router.route("/register").post(registerNewUser);
router.route("/login").post(handleLoginUser);
router.route("/me").get(handleGetUserData);
router.route("/profile").put(handleUpdateUserData);

// Admin Only
router.route("/users").get(handleGetAllUserData);
router.route("/users/:id/block").put(handleBlockSelectedUser);
router.route("/users/:id/unblock").put(handleUnblockSelectedUser);

export default router