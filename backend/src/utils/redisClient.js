// src/utils/redisClient.js
import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const redisUrl = process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || "127.0.0.1"}:${process.env.REDIS_PORT || 6379}`;

const client = createClient({
  url: redisUrl,
  socket: {
    reconnectStrategy: retries => {
      // exponential backoff up to ~30s
      return Math.min(retries * 50, 30000);
    }
  },
  password: process.env.REDIS_PASSWORD || undefined,
  database: process.env.REDIS_DB ? Number(process.env.REDIS_DB) : undefined
});

client.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

client.on("connect", () => {
  console.log("Redis client connecting...");
});

client.on("ready", () => {
  console.log("✅ Redis ready");
});

client.on("end", () => {
  console.log("Redis connection closed");
});

async function connectRedis() {
  if (!client.isOpen) {
    await client.connect();
  }
}

export { client, connectRedis };
