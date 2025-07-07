import { Router } from "express";
import {
  handleGetAllCourses,
  handleGetFilterCourses,
  handleCreateNewCourse,
  handleGetCourseDetails,
  handleUpdateCourseDetails,
  handleDeleteCourseDetails,
} from "../controllers/course.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import authorizeRole from "../middleware/role.middleware.js";
import { fileUpload } from "../middleware/multer.middleware.js";

const router = Router();
router.use(verifyJWT);

router
  .route("/")
  .get(handleGetAllCourses)
  .post(
    authorizeRole("instructor"),
    fileUpload("thumbnails").single("thumbnail"),
    handleCreateNewCourse
  );
router.route("/search").get(handleGetFilterCourses);
router
  .route("/:id")
  .get(handleGetCourseDetails)
  .put(authorizeRole("instructor"), handleUpdateCourseDetails)
  .delete(authorizeRole("instructor", "admin"), handleDeleteCourseDetails);

export default router;
