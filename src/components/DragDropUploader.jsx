import { useState, useRef } from "react"
import Button from "./Button"
import { cn } from "../utils/utils"

const DragDropUploader = ({ onFilesSelected, className, disabled }) => {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (disabled) return

    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("image/")
    )

    if (files.length > 0 && onFilesSelected) {
      onFilesSelected(files)
    }
  }

  const handleFileSelect = (e) => {
    if (disabled) return

    const files = Array.from(e.target.files).filter((file) =>
      file.type.startsWith("image/")
    )

    if (files.length > 0 && onFilesSelected) {
      onFilesSelected(files)
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleBrowseClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <div
      className={cn(
        "border-2 border-dashed rounded-lg transition-all duration-200",
        disabled
          ? "border-gray-200 bg-gray-50 opacity-50 cursor-not-allowed"
          : isDragging
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 bg-white hover:border-gray-400",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="mb-4">
          <svg
            className="w-16 h-16 text-gray-400 mx-auto"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <p className="text-lg font-medium text-gray-700 mb-1">
          Drag and drop photos here
        </p>
        <p className="text-sm text-gray-500 mb-4">or</p>
        <Button variant="default" onClick={handleBrowseClick} type="button" className="bg-blue-600 hover:bg-blue-700 text-white" disabled={disabled}>
          Browse Files
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileSelect}
        />
        <p className="text-xs text-gray-500 mt-4">
          Supports: JPG, PNG, WEBP (Max 10MB)
        </p>
      </div>
    </div>
  )
}

export default DragDropUploader
