import { Router } from "express";
import {
  handleAddReview,
  handleGetAllReviews,
  handleDeleteReview,
} from "../controllers/review.controller.js";

const router = Router();

router
  .route("/:courseId")
  .post(handleAddReview)
  .get(handleGetAllReviews)
  .delete(handleDeleteReview);

export default router;
