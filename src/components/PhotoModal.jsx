import { useEffect } from "react"
import { cn } from "../utils/utils"

const PhotoModal = ({ photo, isOpen, onClose, onNext, onPrevious, hasNext, hasPrevious }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }

    const handleArrowKeys = (e) => {
      if (!isOpen) return

      if (e.key === "ArrowLeft" && hasPrevious) {
        onPrevious()
      } else if (e.key === "ArrowRight" && hasNext) {
        onNext()
      }
    }

    window.addEventListener("keydown", handleEscape)
    window.addEventListener("keydown", handleArrowKeys)

    return () => {
      window.removeEventListener("keydown", handleEscape)
      window.removeEventListener("keydown", handleArrowKeys)
    }
  }, [isOpen, hasNext, hasPrevious, onClose, onNext, onPrevious])

  if (!isOpen || !photo) return null

  const { thumbnail, name, processedAt, file, filepath } = photo
  // Construct image URL from filepath or use thumbnail/file
  const baseURL = import.meta.env.VITE_BASE_URL || "http://localhost:5000"
  const imageUrl = thumbnail || filepath ? `${baseURL}${filepath}` : (file ? URL.createObjectURL(file) : null)

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 text-white hover:text-gray-300 transition-all duration-200 p-2 rounded-lg"
        aria-label="Close modal"
      >
        <svg
          className="w-6 h-6"
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

      {/* Navigation Arrows */}
      {hasPrevious && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onPrevious()
          }}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-all duration-200 p-3 bg-black/50 rounded-full hover:bg-black/70"
          aria-label="Previous photo"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      )}

      {hasNext && (
        <button
          onClick={(e) => {
            e.stopPropagation()
            onNext()
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-white hover:text-gray-300 transition-all duration-200 p-3 bg-black/50 rounded-full hover:bg-black/70"
          aria-label="Next photo"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      )}

      {/* Image Container */}
      <div
        className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="max-w-full max-h-full object-contain rounded-xl"
          />
        ) : (
          <div className="text-white text-center">
            <svg
              className="w-24 h-24 mx-auto mb-4 text-gray-400"
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
            <p className="text-gray-400">Image not available</p>
          </div>
        )}

        {/* Photo Info */}
        {(name || processedAt) && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-sm rounded-xl px-4 py-2 text-white text-sm">
            {name && <p className="font-medium">{name}</p>}
            {processedAt && (
              <p className="text-xs text-gray-300 mt-1">
                {new Date(processedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default PhotoModal

