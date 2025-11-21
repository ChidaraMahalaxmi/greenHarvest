// backend/src/controllers/product.controller.js
import Product from "../models/Product.js";

export const createProduct = async (req, res) => {
  try {
    const farmerId = req.user.id;
    const { name, description, category, price, stock, images } = req.body;
    const product = await Product.create({
      farmer: farmerId,
      name,
      description,
      category,
      price,
      stock,
      images
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: "Create product failed", error: err.message });
  }
};

export const listProducts = async (req, res) => {
  try {
    const products = await Product.find({ adminVerified: true }).populate("farmer", "name");
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).populate("farmer", "name");
    if (!p) return res.status(404).json({ message: "Product not found" });
    res.json(p);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
