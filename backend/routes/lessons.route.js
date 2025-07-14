import { Router } from "express";
import {
  handleAddLessonCourse,
  handleEditLesson,
  handleDeleteLesson,
  handleGetAllLessons,
} from "../controllers/lesson.controller.js";
import { fileUpload } from "../middleware/multer.middleware.js";

const router = Router();

router
  .route("/:courseId")
  .post(
    fileUpload("./").fields([
      { name: "video", maxCount: 1 },
      { name: "pdf", maxCount: 1 },
    ]),
    handleAddLessonCourse
  )
  .get(handleGetAllLessons);
router.route("/:lessonId").put(handleEditLesson).delete(handleDeleteLesson);

export default router;
