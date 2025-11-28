// Format file size
export const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

// Format date
export const formatDate = (date, options = {}) => {
  if (!date) return ""
  return new Date(date).toLocaleDateString("en-US", options)
}

// Format time ago
export const formatTimeAgo = (date) => {
  if (!date) return ""
  const seconds = Math.floor((new Date() - new Date(date)) / 1000)
  if (seconds < 60) return `${seconds} ${seconds === 1 ? "second" : "seconds"} ago`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
  const days = Math.floor(hours / 24)
  return `${days} ${days === 1 ? "day" : "days"} ago`
}

// Build event log from photos
export const buildEventLog = (photos) => {
  return photos
    .flatMap((photo) =>
      (photo.events || []).map((event) => ({
        id: `${photo.id}-${event.timestamp}`,
        type: event.message.toLowerCase().includes("completed")
          ? "complete"
          : event.message.toLowerCase().includes("started")
          ? "process"
          : "upload",
        message: `${photo.name}: ${event.message}`,
        timestamp: event.timestamp,
        status: "success",
      }))
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
    .slice(0, 20)
}

