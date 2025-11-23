import express from "express";
import {
  createOrder,
  myOrders,
  getOrder,
  updatePaymentMethod,
  cancelOrder,
  updateOrderAddress
} from "../controllers/order.controller.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// CREATE ORDER
router.post("/", protect, createOrder);

// GET ALL ORDERS OF LOGGED-IN USER
router.get("/my-orders", protect, myOrders);

// GET A SINGLE ORDER
router.get("/:id", protect, getOrder);

// Update payment method
router.patch("/:orderId/payment-method", protect, updatePaymentMethod);

// Cancel order
router.patch("/:orderId/cancel", protect, cancelOrder);

// Update delivery address
router.patch("/:orderId/address", protect, updateOrderAddress);

export default router;
