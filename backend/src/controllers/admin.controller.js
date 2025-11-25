import User from "../models/User.js";
import Order from "../models/Order.js";

export const listFarmers = async (req, res) => {
  try {
    const farmers = await User.find({ role: "farmer" }).select("-password").sort({ createdAt: -1 });
    return res.json({ count: farmers.length, farmers });
  } catch (err) {
    console.error("listFarmers error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const verifyFarmer = async (req, res) => {
  try {
    const { farmerId } = req.params;
    const { verified, note } = req.body;

    const farmer = await User.findById(farmerId);
    if (!farmer) return res.status(404).json({ message: "Farmer not found" });
    if (farmer.role !== "farmer") return res.status(400).json({ message: "User is not a farmer" });

    farmer.certificateVerified = !!verified;
    farmer.certificateNote = note || "";
    await farmer.save();

    return res.json({ message: `Farmer certificate ${verified ? "verified" : "unverified"}`, farmer });
  } catch (err) {
    console.error("verifyFarmer error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const adminGetAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("items.product", "name price")
      .populate("user", "name email")
      .populate("assignedTo", "name phone email")
      .sort({ createdAt: -1 });

    return res.json({ count: orders.length, orders });
  } catch (err) {
    console.error("adminGetAllOrders error:", err);
    return res.status(500).json({ error: err.message });
  }
};