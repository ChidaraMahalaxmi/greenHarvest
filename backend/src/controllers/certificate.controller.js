// backend/src/controllers/certificate.controller.js
import Certificate from "../models/certificate.js";
import User from "../models/User.js";

export const uploadCertificate = async (req, res) => {
  // assume req.body.fileUrl & publicId (cloudinary) are provided by upload middleware
  try {
    const farmerId = req.user.id;
    const { fileUrl, publicId } = req.body;
    const cert = await Certificate.create({ farmer: farmerId, fileUrl, publicId });
    // mark user certificate pending
    await User.findByIdAndUpdate(farmerId, { "certificate.url": fileUrl, "certificate.cloudinaryPublicId": publicId, "certificate.status": "pending" });
    res.status(201).json(cert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const listPending = async (req, res) => {
  try {
    const list = await Certificate.find({ status: "pending" }).populate("farmer", "name email");
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const reviewCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, notes } = req.body; // action: approve | reject
    const cert = await Certificate.findById(id);
    if (!cert) return res.status(404).json({ message: "Not found" });
    cert.status = action === "approve" ? "approved" : "rejected";
    cert.reviewedBy = req.user.id;
    cert.reviewedAt = new Date();
    cert.notes = notes || "";
    await cert.save();
    // update user
    await User.findByIdAndUpdate(cert.farmer, { "certificate.status": cert.status, isVerified: cert.status === "approved" });
    res.json(cert);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
