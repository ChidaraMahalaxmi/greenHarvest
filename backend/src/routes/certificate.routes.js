import express from "express";
import multer from "multer";
import { uploadCertificate, listPending, reviewCertificate } from "../controllers/certificate.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();
const upload = multer({ dest: "uploads/certificates/" });

router.post("/upload", protect, restrictTo("farmer"), upload.single("certificate"), uploadCertificate);

// admin endpoints
router.get("/pending", protect, restrictTo("admin"), listPending);
router.patch("/review/:id", protect, restrictTo("admin"), reviewCertificate);

export default router;
