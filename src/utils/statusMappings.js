// Status mappings for UI display
export const STATUS_DISPLAY = {
  uploaded: "uploaded",
  processing: "processing",
  done: "completed",
  completed: "completed",
  pending: "pending",
}

// Status to progress mapping
export const getProgressFromStatus = (status) => {
  const mapping = {
    uploaded: 0,
    pending: 0,
    processing: 50,
    done: 100,
    completed: 100,
  }
  return mapping[status] || 0
}

// Transform API status to UI status
export const transformStatus = (status) => {
  return STATUS_DISPLAY[status] || status
}

