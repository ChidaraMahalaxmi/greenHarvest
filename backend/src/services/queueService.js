// backend/src/services/queueService.js
import { Queue } from "bullmq";
import IORedis from "ioredis";

const connection = new IORedis(process.env.REDIS_URL || "redis://127.0.0.1:6379");

export const emailQueue = new Queue("emailQueue", { connection });
export const orderQueue = new Queue("orderQueue", { connection });

// later you will create workers in backend/jobs or in dedicated workers folder
