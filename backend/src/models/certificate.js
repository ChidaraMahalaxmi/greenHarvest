import mongoose from "mongoose";

const certSchema = new mongoose.Schema({
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileUrl: { type: String, required: true },
  publicId: String, // if using cloudinary
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  reviewedAt: Date,
  notes: String
}, { timestamps: true });

const Certificate = mongoose.model("Certificate", certSchema);
export default Certificate;
