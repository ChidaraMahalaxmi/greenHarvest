// backend/src/jobs/scheduler.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import inventoryMonitor from "./inventoryMonitor.js";

// Load .env variables
dotenv.config();

async function connectDB() {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is missing from .env");
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Scheduler MongoDB connected");
  } catch (err) {
    console.error("Scheduler MongoDB connection error:", err.message);
    process.exit(1);
  }
}

async function startScheduler() {
  await connectDB();

  console.log("⏳ Scheduler started...");

  // Run job every 30 seconds
  setInterval(inventoryMonitor, 30000);
}

startScheduler();
