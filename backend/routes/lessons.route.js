import { Router } from "express";
import {
  handleAddLessonCourse,
  handleEditLesson,
  handleDeleteLesson,
  handleGetAllLessons,
} from "../controllers/lesson.controller.js";
import { fileUpload } from "../middleware/multer.middleware.js";
import authorizeRole from "../middleware/role.middleware.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/:courseId")
  .post(
    authorizeRole("instructor"),
    fileUpload("./").fields([
      { name: "video", maxCount: 1 },
      { name: "pdf", maxCount: 1 },
    ]),
    handleAddLessonCourse
  )
  .get(handleGetAllLessons);
router
  .route("/:lessonId")
  .put(
    authorizeRole("instructor"),
    fileUpload("./").fields([
      { name: "video", maxCount: 1 },
      { name: "pdf", maxCount: 1 },
    ]),
    handleEditLesson
  )
  .delete(authorizeRole("instructor"), handleDeleteLesson);

export default router;
