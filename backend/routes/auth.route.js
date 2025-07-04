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
import authorizeRole from "../middleware/role.middleware.js";

const router = Router();

router.route("/register").post(registerNewUser);
router.route("/login").post(handleLoginUser);
router.route("/me").get(verifyJWT, handleGetUserData);
router.route("/profile").put(verifyJWT, handleUpdateUserData);

// Admin Only
router
  .route("/users")
  .get(verifyJWT, authorizeRole("admin"), handleGetAllUserData);
router
  .route("/users/:id/block")
  .put(verifyJWT, authorizeRole("admin"), handleBlockSelectedUser);
router
  .route("/users/:id/unblock")
  .put(verifyJWT, authorizeRole("admin"), handleUnblockSelectedUser);

export default router;
