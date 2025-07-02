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
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(registerNewUser);
router.route("/login").post(handleLoginUser);
router.route("/me").get(verifyJWT, handleGetUserData);
router.route("/profile").put(verifyJWT, handleUpdateUserData);

// Admin Only
router.route("/users").get(verifyJWT, handleGetAllUserData);
router.route("/users/:id/block").put(verifyJWT, handleBlockSelectedUser);
router.route("/users/:id/unblock").put(verifyJWT, handleUnblockSelectedUser);

export default router;
