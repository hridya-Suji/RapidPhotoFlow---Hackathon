import { useState, useRef, useEffect, memo, useCallback } from "react"
import { cn } from "../utils/utils"

const PhotoMenu = memo(({ onDelete, onReshare, className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  const handleDelete = useCallback(() => {
    setIsOpen(false)
    if (onDelete) onDelete()
  }, [onDelete])

  const handleReshare = useCallback(() => {
    setIsOpen(false)
    if (onReshare) onReshare()
  }, [onReshare])

  return (
    <div className={cn("relative", className)} ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsOpen(!isOpen)
        }}
        className="p-1 rounded"
        aria-label="Menu"
      >
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute bottom-full right-0 mb-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
          <button
            onClick={handleDelete}
            className="w-full text-left px-4 py-2 text-sm text-gray-700"
          >
            Delete
          </button>
          <button
            onClick={handleReshare}
            className="w-full text-left px-4 py-2 text-sm text-gray-700"
          >
            Reshare
          </button>
        </div>
      )}
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    prevProps.onDelete === nextProps.onDelete &&
    prevProps.onReshare === nextProps.onReshare &&
    prevProps.className === nextProps.className
  )
})

PhotoMenu.displayName = "PhotoMenu"

export default PhotoMenu

