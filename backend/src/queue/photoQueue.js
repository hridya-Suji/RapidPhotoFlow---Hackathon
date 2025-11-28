import { Queue } from "bullmq"
import redis from "./queueConfig.js"

// Create BullMQ Queue named "photoQueue"
// Configured for non-blocking operations - queue.add() returns immediately
const photoQueue = new Queue("photoQueue", {
  connection: redis,
  // Queue-level settings for optimal performance
  settings: {
    // Stalled interval: how often to check for stalled jobs (in ms)
    stalledInterval: 30000, // 30 seconds
    // Max stalled count: max times a job can be stalled before failing
    maxStalledCount: 1,
    // Retry process delay: delay before retrying failed jobs
    retryProcessDelay: 5000, // 5 seconds
  },
  defaultJobOptions: {
    // Number of retry attempts
    attempts: 3,
    // Backoff strategy for retries
    backoff: {
      type: "exponential",
      delay: 2000, // Start with 2 seconds, exponential backoff
    },
    // Remove completed jobs automatically to save memory
    removeOnComplete: {
      age: 3600, // Keep completed jobs for 1 hour
      count: 1000, // Keep max 1000 completed jobs
    },
    // Remove failed jobs automatically
    removeOnFail: {
      age: 24 * 3600, // Keep failed jobs for 24 hours
    },
    // Job timeout (prevent jobs from running forever)
    timeout: 60000, // 60 seconds max per job
    // Don't wait for job completion when adding
    // This ensures queue.add() returns immediately
  },
})

// Export addJob function - returns Promise but should NOT be awaited in upload handler
// This function is fire-and-forget - it adds job to Redis queue asynchronously
// photoQueue.add() is non-blocking - it immediately returns after queuing to Redis
export const addJob = async (photoId) => {
  try {
    // photoQueue.add() is non-blocking - Redis operations are async
    // The function returns immediately after adding job to Redis queue
    // Using defaultJobOptions from queue config for consistency
    const job = await photoQueue.add(
      "processPhoto",
      {
        photoId: photoId.toString(),
      },
      {
        // Job-specific options (inherit from defaultJobOptions if not specified)
        // These ensure the job is added without blocking
        removeOnComplete: true, // Auto-remove when complete
        removeOnFail: {
          age: 24 * 3600, // Keep failed jobs for 24 hours
        },
      }
    )
    // Logging happens asynchronously to avoid blocking
    setImmediate(() => {
      console.log(`✅ Job added to queue: ${job.id} for photo: ${photoId}`)
    })
    return job
  } catch (error) {
    // Error handling - log but don't throw (for fire-and-forget usage)
    console.error(`❌ Error adding job to queue for photo ${photoId}:`, error)
    throw error
  }
}

export default photoQueue

