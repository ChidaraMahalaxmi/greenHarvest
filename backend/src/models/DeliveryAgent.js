// src/models/DeliveryAgent.js
import mongoose from "mongoose";

const deliveryAgentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String },
    email: { type: String, unique: true, required: true },
    active: { type: Boolean, default: true }, // agent available by default
    // optional: add location / vehicle info if needed later
    // location: { type: String },
  },
  { timestamps: true }
);

const DeliveryAgent = mongoose.model("DeliveryAgent", deliveryAgentSchema);
export default DeliveryAgent;
