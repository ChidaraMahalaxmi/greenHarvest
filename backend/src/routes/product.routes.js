import express from "express";
import {
  createProduct,
  listProducts,
  getProduct,
  updateProduct,
  deleteProduct,
  farmerProducts
} from "../controllers/product.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public
router.get("/", listProducts);

// Farmer-only product list
router.get("/farmer/products", protect, restrictTo("farmer"), farmerProducts);

// Create product
router.post("/", protect, restrictTo("farmer"), createProduct);

// Update product
router.put("/:id", protect, restrictTo("farmer"), updateProduct);

// Delete product
router.delete("/:id", protect, restrictTo("farmer"), deleteProduct);

// Get product details last
router.get("/:id", getProduct);

export default router;
