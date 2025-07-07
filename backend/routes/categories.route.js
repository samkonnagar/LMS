import { Router } from "express";
import {
  handleGetAllCategories,
  handleAddCategory,
  handleDeleteCategory,
} from "../controllers/categories.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import authorizeRole from "../middleware/role.middleware.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/")
  .get(handleGetAllCategories)
  .post(authorizeRole("admin"), handleAddCategory);

router.route("/:id").delete(authorizeRole("admin"), handleDeleteCategory);

export default router;
