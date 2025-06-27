import { Router } from "express";
import {
  handleGetAllNotifications,
  handleSendNotifications,
  handleDeleteNotifications,
} from "../controllers/notification.controller.js";

const router = Router();

router.route("/").get(handleGetAllNotifications);
router.route("/send").post(handleSendNotifications);

router.route("/:id").delete(handleDeleteNotifications);

export default router;
