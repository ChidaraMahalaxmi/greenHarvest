import Product from "../models/Product.js";

// Add product (farmer only)
export const addProduct = async (req, res) => {
  try {
    const { name, category, description, price, quantity, image } = req.body;

    const product = await Product.create({
      name,
      category,
      description,
      price,
      quantity,
      image,
      farmer: req.user._id,       // logged-in farmer
    });

    res.json({
      message: "Product added successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("farmer", "name email role");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get single product
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "farmer",
      "name email role"
    );

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    if (product.farmer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "You are not the owner" });

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json({
      message: "Product updated",
      product,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Product not found" });

    if (product.farmer.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "You are not the owner" });

    await product.deleteOne();

    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
