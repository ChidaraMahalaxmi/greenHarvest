import Product from "../models/Product.js"; // adjust path if named differently

// Add product (wraps product create logic — supports farmer field)
export const addProduct = async (req, res) => {
  try {
    const payload = { ...req.body, farmer: req.user.id };
    const product = await Product.create(payload);
    return res.status(201).json({ message: "Product added", product });
  } catch (err) {
    return res.status(500).json({ message: "Error adding product", error: err.message });
  }
};

export const getFarmerProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json({ products });
  } catch (err) {
    return res.status(500).json({ message: "Error fetching products", error: err.message });
  }
};

export const getSingleFarmerProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, farmer: req.user.id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json({ product });
  } catch (err) {
    return res.status(500).json({ message: "Error", error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, farmer: req.user.id },
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json({ message: "Updated", product });
  } catch (err) {
    return res.status(500).json({ message: "Error updating product", error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, farmer: req.user.id });
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Error deleting product", error: err.message });
  }
};
