import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["consumer", "farmer", "agent", "admin"],
      default: "consumer",
    },

    // Farmer certificate
    certificateUrl: { type: String },
    certificateVerified: { type: Boolean, default: false },
    certificateNote: { type: String, default: "" },

    // Agent / user phone & active
    phone: { type: String },
    active: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;
