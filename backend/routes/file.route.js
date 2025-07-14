import { Router } from "express";
import {
  handleGetVideo,
  handleGetPdf,
} from "../controllers/file.controller.js";

const router = Router();

router.route("/video/:fileid").get(handleGetVideo);
router.route("/pdf/:fileid").get(handleGetPdf);

export default router;
