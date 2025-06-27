import { Router } from "express";
import {
  handleGetAllCategories,
  handleAddCategory,
  handleDeleteCategory,
} from "../controllers/categories.controller.js";

const router = Router();

router.route("/").get(handleGetAllCategories).post(handleAddCategory);

router.route("/:id").delete(handleDeleteCategory);

export default router;
