// backend/src/app.js
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());

// Test Route
app.get("/", (req, res) => {
  res.send("Backend Server Running!");
});

// Routes
app.use("/api/auth", authRoutes);

export default app;
