import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: { type: String, required: true },
    category: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: String,

    // === NEW FIELDS ===
    lowStockAlertSent: { type: Boolean, default: false },
    outOfStockAlertSent: { type: Boolean, default: false },
    restockedAlertSent: { type: Boolean, default: false }, // <--- NEW
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
