import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import deliveryAgentRoutes from "./routes/deliveryAgent.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import certificateRoutes from "./routes/certificate.routes.js";

import register from "./metrics/prometheus.js";
import farmerRoutes from "./routes/farmer.routes.js";
import farmerAnalyticsRoutes from "./routes/farmerAnalytics.routes.js";


const app = express();

app.use(express.json());
app.use(cors());

// Prometheus metrics route
app.get("/api/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Test
app.get("/", (req, res) => {
  res.send("Backend Server Running!");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/agents", deliveryAgentRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/certificates", certificateRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/farmer", farmerAnalyticsRoutes);


export default app;
