import Product from "../models/Product.js";

// Public list
export const listProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("farmer", "name");
    res.json({ products });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Farmer's own products
export const farmerProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user.id });
    res.json({ products });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
      farmer: req.user.id,
      ...req.body
    });

    res.status(201).json({ product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({ updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "farmer",
      "name"
    );
    res.json({ product });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
