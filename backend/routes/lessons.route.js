import { Router } from "express";
import {
  handleAddLessonCourse,
  handleEditLesson,
  handleDeleteLesson,
  handleGetAllLessons,
} from "../controllers/lesson.controller.js";

const router = Router();

router.route("/:courseId").post(handleAddLessonCourse).get(handleGetAllLessons);
router.route("/:lessonId").put(handleEditLesson).delete(handleDeleteLesson);

export default router;
