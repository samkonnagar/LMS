import { Router } from "express";
import {
  handleGetAllStats,
  handleGetRevenueStats,
} from "../controllers/admin.controller.js";

const router = Router();

router.route("/stats").get(handleGetAllStats);

router.route("/revenue").get(handleGetRevenueStats);

export default router;
