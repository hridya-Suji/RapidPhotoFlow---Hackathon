// backend/src/queue/queueConfig.js

import Redis from "ioredis";
import dotenv from "dotenv";
dotenv.config();

// BullMQ requires these settings on Windows/Docker
// Optimized for non-blocking operations
export const connection = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD || undefined,
  // REQUIRED by BullMQ - allows async operations without blocking
  maxRetriesPerRequest: null,   // No limit on retries (required by BullMQ)
  enableReadyCheck: false,      // Prevents blocking on connection ready check
  // Connection pool settings for better performance
  lazyConnect: false,           // Connect immediately (not lazy)
  keepAlive: 30000,            // Keep connection alive (30 seconds)
  // Retry strategy for connection failures
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000)
    return delay
  },
});

// Debug logs
connection.on("connect", () => {
  console.log("[Redis] Connected successfully");
});

connection.on("error", (err) => {
  console.error("[Redis] Connection error:", err);
});

export default connection;
