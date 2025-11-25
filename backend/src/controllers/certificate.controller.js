import Certificate from "../models/certificate.js";
import User from "../models/User.js";

// upload uses multer; req.file.path has file path
export const uploadCertificate = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No certificate uploaded" });
    const farmerId = req.user._id;
    const cert = await Certificate.create({ farmer: farmerId, fileUrl: req.file.path, status: "pending" });
    await User.findByIdAndUpdate(farmerId, { certificateUrl: req.file.path, certificateVerified: false });
    return res.status(201).json({ message: "Certificate uploaded", cert });
  } catch (err) {
    console.error("uploadCertificate error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const listPending = async (req, res) => {
  try {
    const list = await Certificate.find({ status: "pending" }).populate("farmer", "name email certificateUrl");
    return res.json(list);
  } catch (err) {
    console.error("listPending error:", err);
    return res.status(500).json({ error: err.message });
  }
};

export const reviewCertificate = async (req, res) => {
  try {
    const { id } = req.params;
    const { action, notes } = req.body;
    const cert = await Certificate.findById(id);
    if (!cert) return res.status(404).json({ message: "Certificate not found" });

    cert.status = action === "approve" ? "approved" : "rejected";
    cert.reviewedBy = req.user._id;
    cert.reviewedAt = new Date();
    cert.notes = notes || "";
    await cert.save();

    // update user
    await User.findByIdAndUpdate(cert.farmer, { certificateUrl: cert.fileUrl, certificateVerified: cert.status === "approved", certificateNote: cert.notes });

    return res.json({ message: "Certificate reviewed", cert });
  } catch (err) {
    console.error("reviewCertificate error:", err);
    return res.status(500).json({ error: err.message });
  }
};
