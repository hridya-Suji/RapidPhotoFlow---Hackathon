import { memo, useMemo } from "react"
import StatusChip from "./StatusChip"
import ProgressBar from "./ProgressBar"
import { cn } from "../utils/utils"

const UploadedFileCard = memo(({ photo, onRemove }) => {
  const { id, name, thumbnail, status, progress, fileSize, file } = photo

  // Memoize image URL to prevent recreation
  const imageUrl = useMemo(() => {
    return thumbnail || (file ? URL.createObjectURL(file) : null)
  }, [thumbnail, file])

  // Memoize file size formatting
  const displayFileSize = useMemo(() => {
    const bytes = fileSize || file?.size
    if (!bytes) return "0 MB"
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(1)} MB`
  }, [fileSize, file?.size])

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-4">
        {/* Thumbnail */}
        <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-100">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none"
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-sm text-gray-900 truncate">{name}</h3>
            {onRemove && (
              <button
                onClick={() => onRemove(id)}
                className="flex-shrink-0 ml-2 text-gray-400 hover:text-red-600 transition-colors duration-200"
                aria-label="Remove file"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="flex items-center gap-3 mb-2">
            <StatusChip status={status === "done" ? "completed" : status} />
            <span className="text-xs text-gray-500">{displayFileSize}</span>
          </div>
          <ProgressBar progress={progress || (status === "completed" || status === "done" ? 100 : 0)} showPercentage={false} />
        </div>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Only rerender if photo data changes
  return (
    prevProps.photo.id === nextProps.photo.id &&
    prevProps.photo.status === nextProps.photo.status &&
    prevProps.photo.progress === nextProps.photo.progress &&
    prevProps.onRemove === nextProps.onRemove
  )
})

UploadedFileCard.displayName = "UploadedFileCard"

export default UploadedFileCard

