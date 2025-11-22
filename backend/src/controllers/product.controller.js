import Product from "../models/Product.js";

// CREATE PRODUCT (Only Farmer)
export const createProduct = async (req, res) => {
  try {
    const { name, category, description, price, quantity, image } = req.body;

    const product = await Product.create({
      farmer: req.user._id, // farmer from token
      name,
      category,
      description,
      price,
      quantity,
      image, // optional (Cloudinary later)
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET ALL PRODUCTS
export const listProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("farmer", "name email");
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET SINGLE PRODUCT
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "farmer",
      "name email"
    );

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
