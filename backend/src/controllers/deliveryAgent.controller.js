import DeliveryAgent from "../models/DeliveryAgent.js";

export const createAgent = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const agent = await DeliveryAgent.create({ name, phone, email });
    return res.status(201).json({ message: "Agent created", agent });
  } catch (err) {
    console.error("createAgent error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const listAgents = async (req, res) => {
  try {
    const agents = await DeliveryAgent.find().sort({ createdAt: -1 });
    return res.json({ count: agents.length, agents });
  } catch (err) {
    console.error("listAgents error:", err);
    return res.status(500).json({ error: err.message });
  }
};