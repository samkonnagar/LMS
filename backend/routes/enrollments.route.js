import { Router } from "express";
import {
  handleEnrollCourse,
  handleGetAllCourses,
  handleGetSelectedCourseProgress,
  markLessonCompleted,
  handleGetPdfCertificate,
} from "../controllers/enrollment.controller.js";

const router = Router();

router.route("/:courseId").post(handleEnrollCourse);
router.route("/my-courses").get(handleGetAllCourses);
router.route("/:courseId/progress").get(handleGetSelectedCourseProgress);
router.route("/:lessonId/complete").post(markLessonCompleted);
router.route("/:courseId/certificate").get(handleGetPdfCertificate);

export default router;
