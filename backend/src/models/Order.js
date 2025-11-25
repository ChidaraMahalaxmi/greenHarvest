import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, required: true },
  priceAtPurchase: { type: Number, required: true }
});

const refundSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["none", "refund_processing", "refund_failed", "refunded"],
    default: "none",
  },
  initiatedAt: Date,
  completedAt: Date,
  reason: String,
  gatewayRef: String
});

const timelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  date: { type: Date, default: Date.now },
  note: String
});

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [orderItemSchema],
    totalAmount: { type: Number, required: true },

    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "Card", "NetBanking"],
      default: "COD",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "prepaid", "paid", "refund_processing", "refunded"],
      default: "pending",
    },
    paymentDetails: {
      upiId: String,
      cardLast4: String,
      bankAccount: String,
      transactionId: String,
      paidAt: Date,
      refund: refundSchema
    },

    orderStatus: {
      type: String,
      enum: ["placed", "processing", "packed", "shipped", "out_for_delivery", "delivered", "canceled"],
      default: "placed"
    },

    orderTimeline: [timelineSchema],

    deliveryAddress: { type: String, required: true },

    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryAgent", default: null }
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
