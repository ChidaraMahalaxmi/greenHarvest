// src/utils/redisLock.js
import { client } from "./redisClient.js";
import { randomBytes } from "crypto";

/**
 * acquireLock(key, ttlMs = 30000)
 * - returns token when acquired
 * - returns null when not acquired
 */
export async function acquireLock(key, ttlMs = 30000) {
  if (!client?.isOpen) {
    console.warn("Redis not connected — skipping lock");
    return null;
  }

  const token = randomBytes(16).toString("hex");
  const ok = await client.set(key, token, {
    NX: true,
    PX: ttlMs
  });

  if (ok === null) return null; // not acquired
  return token;
}

/**
 * releaseLock(key, token)
 * - releases only if token matches (safe release)
 */
export async function releaseLock(key, token) {
  if (!client?.isOpen) return false;

  // safe Lua release
  const lua = `
    if redis.call("get", KEYS[1]) == ARGV[1] then
      return redis.call("del", KEYS[1])
    else
      return 0
    end
  `;
  try {
    const res = await client.eval(lua, {
      keys: [key],
      arguments: [token]
    });
    return res === 1;
  } catch (e) {
    console.error("releaseLock error:", e);
    return false;
  }
}
