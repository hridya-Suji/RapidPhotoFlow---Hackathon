import { useMemo, memo, useCallback } from "react"
import StatusChip from "./StatusChip"
import PhotoMenu from "./PhotoMenu"
import { cn } from "../utils/utils"

const PhotoCard = memo(({ 
  photo, 
  className, 
  onDelete, 
  onRetry, 
  onView,
  isSelectMode = false, 
  isSelected = false, 
  onToggleSelect,
  showRetry = false,
  showMenu = false,
  showStatusBadge = true,
  showViewButton = false,
}) => {
  const { id, name, thumbnail, status, progress, fileSize, file, filepath } = photo
  const isCompleted = status === "completed" || status === "done"
  const isIncomplete = !isCompleted && (status === "uploaded" || status === "pending" || progress < 100)
  const isProcessing = status === "processing"

  // Construct image URL from filepath or use thumbnail/file
  const baseURL = useMemo(() => import.meta.env.VITE_BASE_URL || "http://localhost:5000", [])
  const imageUrl = useMemo(() => {
    if (thumbnail || filepath) {
      return `${baseURL}${filepath}`
    }
    if (file) {
      return URL.createObjectURL(file)
    }
    return null
  }, [baseURL, filepath, thumbnail, file])

  const formatFileSize = (bytes) => {
    if (!bytes) return "0.00 MB"
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  const displayFileSize = useMemo(() => formatFileSize(fileSize || file?.size), [fileSize, file?.size])

  const getProgressColor = () => {
    if (status === "completed" || status === "done") return "bg-green-600"
    if (status === "processing") return "bg-orange-500"
    return "bg-gray-300"
  }

  // Memoized handlers - prevent recreation on every render
  const photoId = useMemo(() => photo._id || photo.id, [photo._id, photo.id])

  const handleRetry = useCallback((e) => {
    e.stopPropagation()
    if (onRetry) onRetry(photoId)
  }, [onRetry, photoId])

  const handleDelete = useCallback(() => {
    if (onDelete) onDelete(photoId)
  }, [onDelete, photoId])

  const handleReshare = useCallback(() => {
    // Removed console.log - no expensive operations
  }, [])

  const handleView = useCallback((e) => {
    e.stopPropagation()
    if (onView) onView(photo)
  }, [onView, photo])

  const handleToggleSelect = useCallback((e) => {
    e.stopPropagation()
    if (onToggleSelect) onToggleSelect(photoId, e.target.checked)
  }, [onToggleSelect, photoId])

  return (
    <div
      className={cn(
        "bg-white rounded-[10px] border border-gray-200 w-full",
        className
      )}
      style={{ boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)", overflow: 'visible' }}
    >
      {/* Image Container - Fixed height, top corners only (merges with white card) */}
      <div 
        className="relative w-full bg-gray-100 rounded-t-[10px]"
        style={{ height: "180px", overflow: "hidden" }}
      >
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

        {/* Status Badge - Top Right (only for Queue, not Gallery) */}
        {!isSelectMode && showStatusBadge && (
          <div className="absolute top-2 right-2 z-10">
            <StatusChip
              status={
                isCompleted
                  ? "completed"
                  : isIncomplete
                  ? "incomplete"
                  : status
              }
            />
          </div>
        )}

        {/* View Button - Top Right (only for Gallery) */}
        {showViewButton && !isSelectMode && (
          <button
            onClick={handleView}
            className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center"
            aria-label="View photo"
          >
            <svg
              className="w-4 h-4 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Compact Footer - 40-50px height max */}
      <div className="px-2.5 py-2 h-[48px] flex items-center justify-between relative" style={{ overflow: 'visible' }}>
        {/* Left: Filename and Size in flex column */}
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-medium text-sm text-gray-900 truncate leading-tight">
            {name}
          </h3>
          <p className="text-xs text-gray-500 leading-tight">
            {displayFileSize}
          </p>
        </div>

        {/* Right: Actions (Checkbox, Menu, or Retry) */}
        <div className="flex-shrink-0 flex items-center gap-2 relative" style={{ overflow: 'visible' }}>
          {/* Checkbox for Select Mode */}
          {isSelectMode && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleToggleSelect}
              onClick={(e) => e.stopPropagation()}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          )}

          {/* 3-dots Menu - Right side of footer (only for completed, not in select mode) */}
          {isCompleted && showMenu && !isSelectMode && (
            <PhotoMenu onDelete={handleDelete} onReshare={handleReshare} />
          )}

          {/* Retry Button - Right side of footer (only for incomplete, not in select mode) */}
          {isIncomplete && showRetry && !isSelectMode && (
            <button
              onClick={handleRetry}
              className="flex items-center gap-1 text-xs text-blue-600 font-medium px-2 py-1"
            >
              <svg
                className="w-3.5 h-3.5"
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
              <span>Retry</span>
            </button>
          )}
        </div>

        {/* Progress Bar - Only for processing state, below footer content */}
        {isProcessing && !isCompleted && (
          <div className="absolute bottom-0 left-0 right-0 px-2.5 pb-1.5">
            <div className="flex justify-between items-center mb-0.5">
              <span className="text-[10px] text-gray-600">Processing</span>
              <span className="text-[10px] text-gray-500">{Math.round(progress || 0)}%</span>
            </div>
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className={cn("h-full", getProgressColor())}
                style={{ width: `${Math.min(100, Math.max(0, progress || 0))}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo - use _id for stable comparison
  // Only rerender if actual data changes, not function references
  const prevId = prevProps.photo._id || prevProps.photo.id
  const nextId = nextProps.photo._id || nextProps.photo.id
  
  // If ID changed, definitely rerender
  if (prevId !== nextId) return false
  
  // Check if photo data changed
  if (
    prevProps.photo.status !== nextProps.photo.status ||
    prevProps.photo.progress !== nextProps.photo.progress ||
    prevProps.photo.updatedAt !== nextProps.photo.updatedAt ||
    prevProps.photo.name !== nextProps.photo.name
  ) {
    return false
  }
  
  // Check if UI state changed
  if (
    prevProps.isSelectMode !== nextProps.isSelectMode ||
    prevProps.isSelected !== nextProps.isSelected ||
    prevProps.showRetry !== nextProps.showRetry ||
    prevProps.showMenu !== nextProps.showMenu ||
    prevProps.showStatusBadge !== nextProps.showStatusBadge ||
    prevProps.showViewButton !== nextProps.showViewButton ||
    prevProps.className !== nextProps.className
  ) {
    return false
  }
  
  // All props are the same - skip rerender
  return true
})

PhotoCard.displayName = "PhotoCard"

export default PhotoCard
