import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }, // price at time of order
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "UPI", "CARD", "NETBANKING"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },

    orderStatus: {
      type: String,
      enum: ["placed", "processing", "shipped", "delivered", "canceled"],
      default: "placed",
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
