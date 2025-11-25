import express from "express";
import { createAgent, listAgents } from "../controllers/deliveryAgent.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, restrictTo("admin"), createAgent);
router.get("/", protect, restrictTo("admin"), listAgents);

export default router;