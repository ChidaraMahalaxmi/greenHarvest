// src/server.js
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import app from "./app.js";
import { connectRedis } from "./utils/redisClient.js";

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    // Connect Mongo
    await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
    console.log("MongoDB Connected");

    // Connect Redis
    try {
      await connectRedis();
    } catch (e) {
      console.error("Failed to connect Redis:", e.message || e);
      // continue — your app can still run, but locks/emails may fail
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Startup error:", err);
    process.exit(1);
  }
}

start();
