import Order from "../models/Order.js";
import Product from "../models/Product.js";

// ------------------------------------------------------------
// 1. CREATE ORDER (with atomic stock update)
// ------------------------------------------------------------
export const createOrder = async (req, res) => {
  try {
    const { productId, orderQuantity } = req.body;

    // Atomic update: only reduce stock if enough quantity exists
    const updatedProduct = await Product.findOneAndUpdate(
      {
        _id: productId,
        quantity: { $gte: orderQuantity }
      },
      {
        $inc: { quantity: -orderQuantity }
      },
      { new: true }
    );

    if (!updatedProduct) {
      return res
        .status(400)
        .json({ message: "Not enough stock available for this product" });
    }

    // Create order entry
    const order = await Order.create({
      user: req.user._id,
      product: productId,
      quantity: orderQuantity,
      totalAmount: updatedProduct.price * orderQuantity,
      status: "placed",
    });

    res.json({
      message: "Order placed successfully",
      order,
      remainingStock: updatedProduct.quantity,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------------------------------------------------
// 2. GET ALL ORDERS FOR LOGGED-IN USER
// ------------------------------------------------------------
export const myOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("product", "name price")
      .sort({ createdAt: -1 }); // latest first

    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ------------------------------------------------------------
// 3. GET SINGLE ORDER DETAILS
// ------------------------------------------------------------
export const getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      user: req.user._id, // user can view only their own order
    }).populate("product", "name price category");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// Update Payment Method
export const updatePaymentMethod = async (req, res) => {
  try {
    const { paymentMethod } = req.body;

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus !== "placed") {
      return res.status(400).json({
        message: "Cannot change payment method after order is processed"
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    order.paymentMethod = paymentMethod;
    await order.save();

    res.json({
      message: "Payment method updated successfully",
      order
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Cancel Order
export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.orderStatus !== "placed") {
      return res.status(400).json({
        message: "Order cannot be canceled now"
      });
    }

    order.orderStatus = "canceled";
    await order.save();

    res.json({
      message: "Order canceled successfully",
      order
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// Update Delivery Address
export const updateOrderAddress = async (req, res) => {
  try {
    const { address } = req.body;

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (order.orderStatus !== "placed") {
      return res.status(400).json({
        message: "Cannot update address after order is processed"
      });
    }

    order.deliveryAddress = address;
    await order.save();

    res.json({
      message: "Delivery address updated successfully",
      order
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

