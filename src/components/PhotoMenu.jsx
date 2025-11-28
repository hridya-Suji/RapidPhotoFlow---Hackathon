import { useState, useRef, useEffect, memo, useCallback } from "react"
import { cn } from "../utils/utils"

const PhotoMenu = memo(({ onDelete, onReshare, className }) => {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)
  const buttonRef = useRef(null)

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) &&
          buttonRef.current && !buttonRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      // Use capture phase to catch clicks before they bubble
      document.addEventListener("mousedown", handleClickOutside, true)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside, true)
    }
  }, [isOpen])

  const handleToggle = useCallback((e) => {
    e.stopPropagation()
    setIsOpen((prev) => !prev)
  }, [])

  const handleDelete = useCallback((e) => {
    e.stopPropagation()
    setIsOpen(false)
    if (onDelete) onDelete()
  }, [onDelete])

  const handleReshare = useCallback((e) => {
    e.stopPropagation()
    setIsOpen(false)
    // Reshare functionality not implemented - just close menu
    if (onReshare) onReshare()
  }, [onReshare])

  return (
    <div className={cn("relative", className)}>
      {/* 3-dots Button */}
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="p-1 rounded"
        aria-label="Menu"
        type="button"
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

      {/* Dropdown Menu - Positioned below and right-aligned */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute top-full right-0 mt-1 w-40 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50"
          style={{ 
            position: 'absolute',
            zIndex: 50,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleDelete}
            className="w-full text-left px-4 py-2 text-sm text-gray-700"
            type="button"
          >
            Delete Photo
          </button>
          <button
            onClick={handleReshare}
            className="w-full text-left px-4 py-2 text-sm text-gray-700"
            type="button"
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

