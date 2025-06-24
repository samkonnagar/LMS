import { Router } from "express";
import {
  handleGetAllCourses,
  handleGetFilterCourses,
  handleCreateNewCourse,
  handleGetCourseDetails,
  handleUpdateCourseDetails,
  handleDeleteCourseDetails,
} from "../controllers/course.controller.js";

const router = Router();

router.route("/").get(handleGetAllCourses).post(handleCreateNewCourse);
router.route("/search").get(handleGetFilterCourses);
router
  .route("/:id")
  .get(handleGetCourseDetails)
  .put(handleUpdateCourseDetails)
  .delete(handleDeleteCourseDetails);

export default router;
