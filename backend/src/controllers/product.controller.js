import Product from "../models/Product.js";

// 👉 CREATE PRODUCT (Farmer only)
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create({
    farmer: req.user._id,
    ...req.body,
    });

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// 👉 GET SINGLE PRODUCT
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

// 👉 GET ALL + SEARCH PRODUCTS
export const listProducts = async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;

    let filter = {};

    if (name) {
      filter.name = { $regex: name, $options: "i" };
    }

    if (category) {
      filter.category = { $regex: category, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(filter);

    res.json({
      count: products.length,
      products,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
