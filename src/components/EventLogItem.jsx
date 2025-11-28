import { memo } from "react"

const EventLogItem = memo(({ event }) => {
  const { type, message, timestamp } = event

  const getIcon = () => {
    if (type === "complete") {
      return (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )
    }
    if (type === "process") {
      return (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
    if (type === "upload") {
      return (
        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    }
    return null
  }

  const getTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000)
    if (seconds < 60) return `${seconds} seconds ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
    const days = Math.floor(hours / 24)
    return `${days} ${days === 1 ? "day" : "days"} ago`
  }

  return (
    <div className="flex items-start gap-3 p-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors duration-200">
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-gray-900">{message}</p>
        <p className="text-xs text-gray-500 mt-1">
          {getTimeAgo(timestamp)}
        </p>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Only rerender if event data changes
  return (
    prevProps.event.id === nextProps.event.id &&
    prevProps.event.type === nextProps.event.type &&
    prevProps.event.message === nextProps.event.message &&
    prevProps.event.timestamp === nextProps.event.timestamp
  )
})

EventLogItem.displayName = "EventLogItem"

export default EventLogItem
