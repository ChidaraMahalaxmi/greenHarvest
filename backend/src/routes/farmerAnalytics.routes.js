import express from "express";
import { protect, restrictTo } from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";

const router = express.Router();

// Farmer Analytics Route
router.get("/stats", protect, restrictTo("farmer"), async (req, res) => {
  try {
    const farmerId = req.user._id;

    // Total products
    const products = await Product.find({ farmer: farmerId });

    // Low stock
    const lowStock = products.filter((p) => p.quantity < 10);

    // Out-of-stock
    const outOfStock = products.filter((p) => p.quantity === 0);

    // Orders for this farmer
    const orders = await Order.find({ "items.farmer": farmerId });

    // Total revenue
    let revenue = 0;
    orders.forEach((order) => {
      order.items.forEach((i) => {
        if (i.farmer.toString() === farmerId.toString()) {
          revenue += i.price * i.quantity;
        }
      });
    });

    res.json({
      productsCount: products.length,
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length,
      totalOrders: orders.length,
      revenue,
      recentOrders: orders.slice(-5).reverse(),
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to load analytics" });
  }
});

export default router;
