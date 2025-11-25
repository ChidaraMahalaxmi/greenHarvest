// src/controllers/auth.controller.js
import User from "../models/User.js";
import bcrypt from "bcrypt";
import generateToken from "../utils/generateToken.js";
import DeliveryAgent from "../models/DeliveryAgent.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    // 1️⃣ Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    // 2️⃣ If user is AGENT → create deliveryAgent entry
    // after creating user in register()
if (role === "agent") {
  // create DeliveryAgent document so we can use the DeliveryAgent collection
  const deliveryAgent = await DeliveryAgent.create({
    name,
    email,
    phone: req.body.phone || "",
    active: true,
  });
  // optionally link deliveryAgent._id to user (if you add a field on User)
  // await User.findByIdAndUpdate(user._id, { deliveryAgentId: deliveryAgent._id });
}


    return res.json({
      message: "Registered Successfully",
      token: generateToken(user._id),
      user,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    return res.json({
      message: "Login Successful",
      token: generateToken(user._id),
      user,
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

// PROFILE
export const me = async (req, res) => {
  return res.json(req.user);
};
