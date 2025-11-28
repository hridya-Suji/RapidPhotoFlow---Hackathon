import { useMemo, memo } from "react"
import Card from "./Card"
import StatusChip from "./StatusChip"
import PhotoMenu from "./PhotoMenu"
import { cn } from "../utils/utils"

const QueueCard = memo(({ photo, className, onDelete, onRetry, isSelectMode, isSelected, onToggleSelect }) => {
  const { id, name, thumbnail, status, progress, fileSize, file, filepath } = photo
  const isCompleted = status === "completed" || status === "done"
  const isIncomplete = !isCompleted && (status === "uploaded" || status === "pending" || progress < 100)

  // Construct image URL from filepath or use thumbnail/file
  const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000"
  const imageUrl = thumbnail || filepath ? `${baseURL}${filepath}` : (file ? URL.createObjectURL(file) : null)

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 MB"
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  const displayFileSize = useMemo(() => formatFileSize(fileSize || file?.size), [fileSize, file?.size])

  const getProgressColor = () => {
    if (status === "completed" || status === "done") return "bg-green-600"
    if (status === "processing") return "bg-orange-500"
    return "bg-gray-300"
  }

  const handleRetry = (e) => {
    e.stopPropagation()
    if (onRetry) onRetry(id)
  }

  const handleDelete = () => {
    if (onDelete) onDelete(id)
  }

  const handleReshare = () => {
    console.log("Reshare clicked")
  }

  return (
    <Card className={cn("overflow-hidden hover:shadow-md transition-all duration-200", className)}>
      <div className="relative bg-gray-100 rounded-t-lg overflow-hidden" style={{ height: "200px" }}>
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
            onError={(e) => {
              e.target.style.display = "none"
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg
              className="w-12 h-12"
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
        
        {/* Checkbox for Select Mode - Top Left */}
        {isSelectMode && (
          <div className="absolute top-3 left-3 z-10">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={(e) => {
                e.stopPropagation()
                if (onToggleSelect) onToggleSelect(id, e.target.checked)
              }}
              onClick={(e) => e.stopPropagation()}
              className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>
        )}

        {/* Status Badge - Top Right */}
        {!isSelectMode && (
          <div className="absolute top-3 right-3">
            <StatusChip
              status={
                isCompleted
                  ? status === "done"
                    ? "completed"
                    : status
                  : isIncomplete
                  ? "incomplete"
                  : status === "done"
                  ? "completed"
                  : status
              }
            />
          </div>
        )}

        {/* Menu for Completed Items - Bottom Right (only in non-select mode) */}
        {isCompleted && !isSelectMode && (
          <div className="absolute bottom-3 right-3">
            <PhotoMenu onDelete={handleDelete} onReshare={handleReshare} />
          </div>
        )}

        {/* Retry for Incomplete Items - Bottom Right (only in non-select mode) */}
        {isIncomplete && !isSelectMode && (
          <div className="absolute bottom-3 right-3 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <button
              onClick={handleRetry}
              className="flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Retry
            </button>
          </div>
        )}
      </div>

      <Card.Content className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">
              {name}
            </h3>
            <p className="text-xs text-gray-500">
              {displayFileSize}
            </p>
          </div>

          {/* Progress Bar - Only for Incomplete Items */}
          {!isCompleted && (
            <div className="w-full">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-gray-600">
                  {status === "processing" ? "Processing" : status === "pending" ? "Pending" : "Incomplete"}
                </span>
                <span className="text-xs text-gray-500">{Math.round(progress || 0)}%</span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className={cn("h-full transition-all duration-300", getProgressColor())}
                  style={{ width: `${Math.min(100, Math.max(0, progress || 0))}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </Card.Content>
    </Card>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  return (
    prevProps.photo.id === nextProps.photo.id &&
    prevProps.photo.status === nextProps.photo.status &&
    prevProps.photo.progress === nextProps.photo.progress &&
    prevProps.photo.updatedAt === nextProps.photo.updatedAt &&
    prevProps.isSelectMode === nextProps.isSelectMode &&
    prevProps.isSelected === nextProps.isSelected &&
    prevProps.className === nextProps.className
  )
})

QueueCard.displayName = "QueueCard"

export default QueueCard
