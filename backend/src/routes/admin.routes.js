import express from "express";
import { listFarmers, verifyFarmer, adminGetAllOrders } from "../controllers/admin.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/farmers", protect, restrictTo("admin"), listFarmers);
router.patch("/farmers/:farmerId/verify", protect, restrictTo("admin"), verifyFarmer);
router.get("/orders", protect, restrictTo("admin"), adminGetAllOrders);

export default router;