import express from "express";
import { salesReport } from "../controllers/analytics.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/sales", protect, restrictTo("admin","farmer"), salesReport);

export default router;
