import IORedis from "ioredis";
const redis = new IORedis(process.env.REDIS_URL);

export const acquireLock = async (key, ttl = 5000) => {
  const token = `${Date.now()}_${Math.random()}`;
  const ok = await redis.set(key, token, "PX", ttl, "NX");
  return ok ? token : null;
};

export const releaseLock = async (key, token) => {
  const val = await redis.get(key);
  if (val === token) await redis.del(key);
};
