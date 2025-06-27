import { Router } from "express";
import {
  handleUploadVideoFile,
  handleUploadPdfFile,
  handleGetVideo,
  handleGetPdf,
} from "../controllers/file.controller.js";

const router = Router();

router.route("/video").post(handleUploadVideoFile);
router.route("/pdf").post(handleUploadPdfFile);
router.route("/video/:fileid").get(handleGetVideo);
router.route("/pdf/:fileid").get(handleGetPdf);

export default router;
