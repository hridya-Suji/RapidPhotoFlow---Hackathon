// backend/src/worker/worker.js

import { Worker } from "bullmq";
import dotenv from "dotenv";
import Photo from "../models/Photo.js";
import connectDB from "../config/db.js";
import { connection } from "../queue/queueConfig.js";

dotenv.config();

// Connect to MongoDB
connectDB();

// Create BullMQ Worker
const worker = new Worker(
  "photoQueue",
  async (job) => {
    const { photoId } = job.data;
    console.log(`[Worker] Processing job ${job.id} for photo: ${photoId}`);

    try {
      // Find the photo
      const photo = await Photo.findById(photoId);
      if (!photo) throw new Error(`Photo with ID ${photoId} not found`);

      console.log(`[Worker] Photo found: ${photo.filename}`);

      // Update status → processing
      photo.status = "processing";
      photo.events.push({
        timestamp: new Date(),
        message: "Processing started",
      });
      await photo.save();
      console.log(`[Worker] Photo ${photoId} marked as processing`);

      // Simulate 2–4 second processing
      const delay = Math.random() * 2000 + 2000;
      console.log(
        `[Worker] Simulating processing for ${(delay / 1000).toFixed(2)} seconds...`
      );
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Update status → done
      photo.status = "done";
      photo.events.push({
        timestamp: new Date(),
        message: "Processing completed",
      });
      await photo.save();

      console.log(`[Worker] Photo ${photoId} completed successfully`);

      return {
        success: true,
        photoId,
        status: "done",
      };
    } catch (error) {
      console.error(`[Worker] Error processing photo ${photoId}:`, error);

      // Add an event indicating error
      try {
        const photo = await Photo.findById(photoId);
        if (photo) {
          photo.events.push({
            timestamp: new Date(),
            message: `Processing failed: ${error.message}`,
          });
          await photo.save();
        }
      } catch (updateError) {
        console.error(`[Worker] Failed to update photo log:`, updateError);
      }

      throw error;
    }
  },
  {
    connection,
    concurrency: 5,
    limiter: {
      max: 10,
      duration: 1000,
    },
  }
);

// Worker event logs
worker.on("completed", (job) => {
  console.log(`[Worker] Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`[Worker] Job ${job?.id} failed:`, err.message);
});

worker.on("error", (err) => {
  console.error(`[Worker] Worker error:`, err);
});

// Graceful shutdown
const shutdown = async () => {
  console.log("\n[Worker] Shutting down...");
  await worker.close();
  await connection.quit();
  console.log("[Worker] Shutdown complete.");
  process.exit(0);
};

process.on("SIGTERM", shutdown);
process.on("SIGINT", shutdown);

console.log("[Worker] Photo processing worker started");
console.log("[Worker] Waiting for jobs...");

export default worker;
