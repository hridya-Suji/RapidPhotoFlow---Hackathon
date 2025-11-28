import { useState } from "react"
import { uploadPhoto } from "../services/api"
import { transformStatus, getProgressFromStatus } from "../utils/statusMappings"

/**
 * Hook for handling photo uploads
 * @returns {Object} Upload state and handlers
 */
const useUpload = () => {
  const [uploadedPhotos, setUploadedPhotos] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState(null)

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    setError(null)

    try {
      // Create FormData asynchronously to avoid blocking UI
      // Using setTimeout to yield to event loop for large batches
      const formData = await new Promise((resolve) => {
        // Use requestIdleCallback or setTimeout to avoid blocking
        const createFormData = () => {
          const fd = new FormData()
          files.forEach((file) => {
            fd.append("photos", file)
          })
          resolve(fd)
        }
        
        // For large batches, yield to event loop to keep UI responsive
        if (files.length > 20) {
          setTimeout(createFormData, 0)
        } else {
          createFormData()
        }
      })

      // Upload photos - single POST request with all files
      // This is non-blocking - the browser handles the upload in background
      // Progress callback is lightweight and non-blocking
      const uploadedPhotosData = await uploadPhoto(formData, (progress) => {
        // Lightweight progress update - doesn't block UI
        setUploadProgress(progress)
      })
      
      // Reset progress after upload completes
      setUploadProgress(0)

      // Transform API response - this is fast and non-blocking
      const transformedPhotos = uploadedPhotosData.map((photo) => ({
        id: photo._id,
        name: photo.filename,
        filepath: photo.filepath,
        status: transformStatus(photo.status),
        progress: getProgressFromStatus(photo.status),
        fileSize: photo.fileSize || 0,
        uploadedAt: photo.createdAt,
        events: photo.events || [],
      }))

      // Update state - React batches this update
      setUploadedPhotos((prev) => [...prev, ...transformedPhotos])
      return transformedPhotos
    } catch (err) {
      // Handle timeout errors specifically
      if (err.code === 'ECONNABORTED' || err.message?.includes('timeout')) {
        const errorMessage = "Upload timed out. Please try again with fewer photos or check your connection."
        setError(errorMessage)
        throw new Error(errorMessage)
      }
      
      const errorMessage = err.response?.data?.error || err.message || "Failed to upload photos"
      setError(errorMessage)
      throw err
    } finally {
      setIsUploading(false)
    }
  }

  const removePhoto = (id) => {
    setUploadedPhotos((prev) => prev.filter((photo) => photo.id !== id))
  }

  const clearPhotos = () => {
    setUploadedPhotos([])
  }

  return {
    uploadedPhotos,
    isUploading,
    uploadProgress,
    error,
    handleUpload,
    removePhoto,
    clearPhotos,
  }
}

export default useUpload

