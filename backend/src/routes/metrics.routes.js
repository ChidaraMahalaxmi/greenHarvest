import express from "express";
import promClient from "../metrics/prometheus.js";

const router = express.Router();

router.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", promClient.register.contentType);
    res.end(await promClient.register.metrics());
  } catch (err) {
    res.status(500).end(err.message);
  }
});

export default router;
