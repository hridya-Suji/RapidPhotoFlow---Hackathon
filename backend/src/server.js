import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";
import redis from "./queue/queueConfig.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// 1. Connect to MongoDB
connectDB();

// 2. Test Redis connection
redis
  .ping()
  .then(() => {
    console.log("Redis connected successfully ✔️");
  })
  .catch((err) => {
    console.error("Redis connection failed ❌", err);
  });

// 3. Start Express server
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`🌱 Environment: ${process.env.NODE_ENV || "development"}`);
});

// Increase server timeout for large file uploads (5 minutes)
// This ensures uploads don't timeout even for 50+ photos on slow connections
server.timeout = 300000; // 5 minutes
server.keepAliveTimeout = 300000; // 5 minutes
server.headersTimeout = 300000; // 5 minutes

// 4. Graceful shutdown
const shutdown = async () => {
  console.log("\n🔻 Shutting down server...");

  try {
    await redis.quit();
  } catch (err) {
    console.error("Error shutting down Redis:", err);
  }

  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
