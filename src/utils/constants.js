// API endpoints
export const API_ENDPOINTS = {
  PHOTOS: "/photos",
  UPLOAD: "/photos/upload",
  PROCESS: "/photos/process",
  QUEUE: "/photos/queue",
  EVENTS: "/events",
}

// File upload constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ACCEPTED_FILE_TYPES = ["image/jpeg", "image/png", "image/webp"]

// Status constants
export const STATUS = {
  UPLOADED: "uploaded",
  PROCESSING: "processing",
  COMPLETED: "completed",
  PENDING: "pending",
  ERROR: "error",
  DONE: "done",
}

// Event types
export const EVENT_TYPES = {
  UPLOAD: "upload",
  PROCESS: "process",
  COMPLETE: "complete",
  ERROR: "error",
}

