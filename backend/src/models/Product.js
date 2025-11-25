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
    image: String
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
