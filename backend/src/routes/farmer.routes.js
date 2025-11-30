import express from "express";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import {
  addProduct,
  getFarmerProducts,
  getSingleFarmerProduct,
  updateProduct,
  deleteProduct
} from "../controllers/farmer.controller.js";
import { farmerGetOrders } from "../controllers/order.controller.js";

const router = express.Router();

// Farmer endpoints (protected)
router.get("/products", protect, restrictTo("farmer"), getFarmerProducts);
router.post("/products", protect, restrictTo("farmer"), addProduct);
router.get("/products/:id", protect, restrictTo("farmer"), getSingleFarmerProduct);
router.put("/products/:id", protect, restrictTo("farmer"), updateProduct);
router.delete("/products/:id", protect, restrictTo("farmer"), deleteProduct);
router.get("/orders", protect, restrictTo("farmer"), farmerGetOrders);

export default router;
