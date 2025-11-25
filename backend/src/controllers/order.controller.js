// src/controllers/order.controller.js
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import DeliveryAgent from "../models/DeliveryAgent.js";
import { orderCounter, orderValue } from "../metrics/prometheus.js";
import { autoAssignAgent, releaseAgent } from "../utils/assignAgent.js";

const REFUND_DELAY_MINUTES = Number(process.env.REFUND_DELAY_MINUTES) || 2;
const REFUND_DELAY_MS = REFUND_DELAY_MINUTES * 60 * 1000;

const pushTimeline = (orderDoc, status, note = "") => {
  orderDoc.orderTimeline = orderDoc.orderTimeline || [];
  orderDoc.orderTimeline.push({ status, note, date: new Date() });
};

// ----------------- createOrder -----------------
export const createOrder = async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod = "COD", paymentDetails } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    let totalAmount = 0;
    const persistedItems = [];

    for (const item of items) {
      if (!item.product || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({ message: "Each item must include a valid product and positive quantity" });
      }

      const updatedProduct = await Product.findOneAndUpdate(
        { _id: item.product, quantity: { $gte: item.quantity } },
        { $inc: { quantity: -item.quantity } },
        { new: true }
      );

      if (!updatedProduct) {
        return res.status(400).json({ message: `Not enough stock for product ${item.product}` });
      }

      const priceAtPurchase = updatedProduct.price;
      totalAmount += priceAtPurchase * item.quantity;
      persistedItems.push({
        product: item.product,
        quantity: item.quantity,
        priceAtPurchase,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      items: persistedItems,
      deliveryAddress,
      totalAmount,
      paymentMethod,
      paymentDetails: paymentDetails || {},
      paymentStatus: paymentMethod === "COD" ? "pending" : "prepaid",
      orderStatus: "placed",
      orderTimeline: [{ status: "placed", note: "Order created", date: new Date() }],
    });

    // Prometheus metrics (safe-guard)
    try {
      if (orderCounter) orderCounter.inc();
      if (orderValue) orderValue.set(order.totalAmount || 0);
    } catch (e) {
      console.error("metrics error", e);
    }

    return res.status(201).json({ message: "Order placed successfully", order });
  } catch (err) {
    console.error("createOrder error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ----------------- myOrders -----------------
export const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.product", "name price image farmer")
      .populate("assignedTo", "name phone email")
      .sort({ createdAt: -1 });

    return res.json({ count: orders.length, orders });
  } catch (err) {
    console.error("myOrders error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ----------------- getOrder -----------------
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product", "name price image farmer")
      .populate("assignedTo", "name phone email");

    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role !== "admin" && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    return res.json(order);
  } catch (err) {
    console.error("getOrder error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ----------------- updatePaymentMethod -----------------
export const updatePaymentMethod = async (req, res) => {
  try {
    const { paymentMethod, paymentDetails } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });
    if (order.orderStatus !== "placed") return res.status(400).json({ message: "Cannot update payment after processing started" });

    order.paymentMethod = paymentMethod;
    if (paymentDetails) order.paymentDetails = { ...order.paymentDetails, ...paymentDetails };
    order.paymentStatus = paymentMethod === "COD" ? "pending" : "prepaid";
    pushTimeline(order, "payment_method_updated", `Payment method set to ${paymentMethod}`);
    await order.save();

    return res.json({ message: "Payment method updated", order });
  } catch (err) {
    console.error("updatePaymentMethod error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ----------------- cancelOrder -----------------
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate("items.product");
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.orderStatus === "canceled") return res.status(400).json({ message: "Order is already canceled" });
    if (order.orderStatus === "delivered") return res.status(400).json({ message: "Cannot cancel a delivered order" });

    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product._id, { $inc: { quantity: item.quantity } });
    }

    order.orderStatus = "canceled";
    pushTimeline(order, "canceled", "Order canceled by user/admin");

    if (order.paymentMethod !== "COD" && order.paymentStatus !== "refunded") {
      order.paymentStatus = "refund_processing";
      order.paymentDetails = order.paymentDetails || {};
      order.paymentDetails.refund = {
        status: "refund_processing",
        initiatedAt: new Date(),
        reason: "canceled_by_user",
      };
      pushTimeline(order, "refund_processing", "Refund processing initiated (auto-simulated)");
      await order.save();

      setTimeout(async () => {
        try {
          const fresh = await Order.findById(order._id);
          if (!fresh) return;
          if (fresh.paymentDetails?.refund?.status === "refund_processing") {
            fresh.paymentDetails.refund.status = "refunded";
            fresh.paymentDetails.refund.completedAt = new Date();
            fresh.paymentDetails.refund.gatewayRef = `SIM_REF_${Date.now()}`;
            fresh.paymentStatus = "refunded";
            pushTimeline(fresh, "refund_completed", "Refund auto-completed (simulated)");
            await fresh.save();
            console.log(`Auto-refund completed for order ${fresh._id}`);
          }
        } catch (e) {
          console.error("Auto-refund error:", e);
        }
      }, REFUND_DELAY_MS);
    } else {
      await order.save();
    }

    return res.json({ message: "Order canceled. Refund initiated if prepaid (auto simulated).", order });
  } catch (err) {
    console.error("cancelOrder error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ----------------- farmerUpdateOrderStatus -----------------
export const farmerUpdateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["processing", "packed", "shipped"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.populate("items.product", "farmer");
    const notOwned = order.items.some((it) => it.product.farmer && it.product.farmer.toString() !== req.user._id.toString());
    if (notOwned) return res.status(403).json({ message: "You are not the owner of all items in this order" });

    order.orderStatus = status;
    pushTimeline(order, status, `Farmer set status to ${status}`);

    if (status === "packed" && !order.assignedTo) {
      const agent = await autoAssignAgent();
      if (agent) {
        order.assignedTo = agent._id;
        pushTimeline(order, "assigned", `Auto-assigned to agent ${agent.name}`);
        try {
          await DeliveryAgent.findByIdAndUpdate(agent._id, { active: false });
        } catch (e) {
          console.error("Error marking agent inactive:", e);
        }
      } else {
        pushTimeline(order, "assigned_failed", "No active agents available");
      }
    }

    await order.save();
    return res.json({ message: "Order status updated by farmer", order });
  } catch (err) {
    console.error("farmerUpdateOrderStatus error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ----------------- adminUpdateOrderStatus -----------------
export const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["processing", "packed", "shipped", "out_for_delivery", "delivered"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status" });

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.orderStatus = status;
    pushTimeline(order, status, `Admin set status to ${status}`);

    if (status === "packed" && !order.assignedTo) {
      const agent = await autoAssignAgent();
      if (agent) {
        order.assignedTo = agent._id;
        pushTimeline(order, "assigned", `Auto-assigned to agent ${agent.name}`);
        try {
          await DeliveryAgent.findByIdAndUpdate(agent._id, { active: false });
        } catch (e) {
          console.error("Error marking agent inactive:", e);
        }
      } else {
        pushTimeline(order, "assigned_failed", "No active agents available");
      }
    }

    if (status === "delivered" && order.paymentMethod !== "COD" && order.paymentStatus === "prepaid") {
      order.paymentStatus = "paid";
      pushTimeline(order, "payment_confirmed", "Payment confirmed (on delivery)");
    }

    await order.save();
    return res.json({ message: "Order status updated by admin", order });
  } catch (err) {
    console.error("adminUpdateOrderStatus error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ----------------- adminGetAllOrders -----------------
export const adminGetAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "name price")
      .populate("user", "name email")
      .populate("assignedTo", "name phone email")
      .sort({ createdAt: -1 });

    return res.json({ count: orders.length, orders });
  } catch (err) {
    console.error("adminGetAllOrders error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ----------------- adminApproveRefund -----------------
export const adminApproveRefund = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.paymentDetails?.refund || order.paymentDetails.refund.status === "refunded") {
      return res.status(400).json({ message: "No refund pending for this order" });
    }

    order.paymentDetails.refund.gatewayRef = `MANUAL_REF_${Date.now()}`;
    order.paymentDetails.refund.completedAt = new Date();
    order.paymentDetails.refund.status = "refunded";
    order.paymentStatus = "refunded";
    pushTimeline(order, "refund_completed", "Refund completed by admin (manual)");

    await order.save();
    return res.json({ message: "Refund approved and processed (manual)", order });
  } catch (err) {
    console.error("adminApproveRefund error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ----------------- agentGetAssignedOrders -----------------
export const agentGetAssignedOrders = async (req, res) => {
  try {
    const orders = await Order.find({ assignedTo: req.user._id }).populate("items.product", "name price").sort({ createdAt: -1 });
    return res.json({ count: orders.length, orders });
  } catch (err) {
    console.error("agentGetAssignedOrders error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ----------------- agentUpdateOrderStatus -----------------
export const agentUpdateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowed = ["out_for_delivery", "delivered"];
    if (!allowed.includes(status)) return res.status(400).json({ message: "Invalid status for agent" });

    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (!order.assignedTo || order.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not assigned to this order" });
    }

    order.orderStatus = status;
    pushTimeline(order, status, `Agent updated status to ${status}`);

    if (status === "delivered") {
      // release agent (mark active true)
      if (order.assignedTo) {
        try {
          await releaseAgent(order.assignedTo);
        } catch (e) {
          try {
            await DeliveryAgent.findByIdAndUpdate(order.assignedTo, { active: true });
          } catch (e2) {
            console.error("Failed to release agent fallback:", e2);
          }
        }
        pushTimeline(order, "agent_released", "Delivery agent marked available");
      }

      // handle payment for prepaid -> mark as paid on successful delivery
      if (order.paymentMethod !== "COD" && order.paymentStatus === "prepaid") {
        order.paymentStatus = "paid";
        pushTimeline(order, "payment_confirmed", "Payment confirmed on delivery");
      }
    }

    await order.save();
    return res.json({ message: "Order status updated by agent", order });
  } catch (err) {
    console.error("agentUpdateOrderStatus error:", err);
    return res.status(500).json({ error: err.message });
  }
};

// ----------------- updateOrderAddress -----------------
export const updateOrderAddress = async (req, res) => {
  try {
    const { deliveryAddress } = req.body;
    const order = await Order.findById(req.params.orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.toString() !== req.user._id.toString()) return res.status(403).json({ message: "Not authorized" });
    if (order.orderStatus !== "placed") return res.status(400).json({ message: "Address can only be updated for new orders" });

    order.deliveryAddress = deliveryAddress;
    pushTimeline(order, "address_updated", "Delivery address updated by user");
    await order.save();

    return res.json({ message: "Delivery address updated", order });
  } catch (err) {
    console.error("updateOrderAddress error:", err);
    return res.status(500).json({ error: err.message });
  }
};
