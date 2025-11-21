// backend/src/routes/certificate.routes.js
import express from "express";
import { uploadCertificate, listPending, reviewCertificate } from "../controllers/certificate.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/upload", protect, restrictTo("farmer"), uploadCertificate);
router.get("/pending", protect, restrictTo("admin"), listPending);
router.patch("/:id/review", protect, restrictTo("admin"), reviewCertificate);

export default router;
