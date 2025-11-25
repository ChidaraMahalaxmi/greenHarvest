import express from "express";
import {
  createOrder,
  myOrders,
  getOrder,
  updatePaymentMethod,
  cancelOrder,
  updateOrderAddress,
  farmerUpdateOrderStatus,
  adminGetAllOrders,
  adminUpdateOrderStatus,
  adminApproveRefund,
  agentGetAssignedOrders,
  agentUpdateOrderStatus,
} from "../controllers/order.controller.js";

import { protect, restrictTo } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ------------------------------------------
   ADMIN ROUTES
-------------------------------------------*/
router.get("/", protect, restrictTo("admin"), adminGetAllOrders);
router.patch("/:orderId/status", protect, restrictTo("admin"), adminUpdateOrderStatus);
router.patch("/:orderId/refund/approve", protect, restrictTo("admin"), adminApproveRefund);

/* ------------------------------------------
   AGENT ROUTES
-------------------------------------------*/
router.get("/agent/my-orders", protect, restrictTo("agent"), agentGetAssignedOrders);
router.patch("/agent/:orderId/status", protect, restrictTo("agent"), agentUpdateOrderStatus);

/* ------------------------------------------
   FARMER ROUTES
-------------------------------------------*/
router.patch(
  "/farmer/:orderId/status",
  protect,
  restrictTo("farmer"),
  farmerUpdateOrderStatus
);

/* ------------------------------------------
   USER ROUTES
-------------------------------------------*/
router.post("/", protect, createOrder);
router.get("/my-orders", protect, myOrders);
router.patch("/:orderId/payment-method", protect, updatePaymentMethod);
router.patch("/:orderId/cancel", protect, cancelOrder);
router.patch("/:orderId/address", protect, updateOrderAddress);

/* ------------------------------------------
   GET SINGLE ORDER — (place LAST)
-------------------------------------------*/
router.get("/:id", protect, getOrder);

export default router;
