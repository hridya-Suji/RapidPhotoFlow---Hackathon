import { useState, useMemo, memo } from "react"
import Button from "./Button"
import { cn } from "../utils/utils"

const GalleryItem = memo(({ photo, onView, className }) => {
  const { id, thumbnail, name, processedAt, file, filepath, fileSize, tags = [] } = photo
  const [imageError, setImageError] = useState(false)

  // Construct image URL from filepath or use thumbnail/file
  const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000"
  const imageUrl = thumbnail || filepath ? `${baseURL}${filepath}` : (file ? URL.createObjectURL(file) : null)

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 MB"
    const mb = bytes / (1024 * 1024)
    return `${mb.toFixed(2)} MB`
  }

  const displayFileSize = useMemo(() => formatFileSize(fileSize || file?.size), [fileSize, file?.size])

  const handleView = (e) => {
    e.stopPropagation()
    if (onView) {
      onView(photo)
    }
  }

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-lg bg-gray-100 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer",
        className
      )}
      onClick={handleView}
    >
      {/* Image Container - Fixed width for stability */}
      <div className="relative w-full overflow-hidden" style={{ height: "200px" }}>
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
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

        {/* Tags */}
        {tags.length > 0 && (
          <div className="absolute top-2 right-2 flex flex-wrap gap-1 justify-end">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-white/90 backdrop-blur-sm text-xs font-medium px-2 py-0.5 rounded-md text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <Button
            size="sm"
            variant="default"
            onClick={(e) => {
              e.stopPropagation()
              handleView(e)
            }}
            className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            View
          </Button>
        </div>
      </div>

      {/* Card Content - Always visible */}
      <div className="p-3 bg-white">
        {name && (
          <p className="text-sm font-medium text-gray-900 truncate mb-1">{name}</p>
        )}
        <p className="text-xs text-gray-500">{displayFileSize}</p>
      </div>
    </div>
  )
}, (prevProps, nextProps) => {
  // Custom comparison function for React.memo
  return (
    prevProps.photo.id === nextProps.photo.id &&
    prevProps.photo.name === nextProps.photo.name &&
    prevProps.photo.filepath === nextProps.photo.filepath &&
    prevProps.photo.fileSize === nextProps.photo.fileSize &&
    prevProps.className === nextProps.className
  )
})

GalleryItem.displayName = "GalleryItem"

export default GalleryItem
