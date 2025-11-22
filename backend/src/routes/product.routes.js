// backend/src/routes/product.routes.js
import express from "express";
import { createProduct, listProducts, getProduct } from "../controllers/product.controller.js";
import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", listProducts);
router.get("/search", listProducts);
router.get("/:id", getProduct);

// farmers create product
router.post("/", protect, restrictTo("farmer"), createProduct);


export default router;
