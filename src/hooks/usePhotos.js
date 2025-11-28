import { useState, useCallback } from "react"
import { getPhotos, getPhoto, updatePhoto } from "../services/api"
import { transformStatus, getProgressFromStatus } from "../utils/statusMappings"

/**
 * Hook for fetching and managing photos
 * @returns {Object} Photos state and handlers
 */
const usePhotos = () => {
  const [photos, setPhotos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchPhotos = useCallback(async (isInitialLoad = false) => {
    // Only set loading state for initial load
    if (isInitialLoad) {
      setIsLoading(true)
    }
    setError(null)

    try {
      const photosData = await getPhotos()

      // Transform API response - preserve _id for stable keys
      const transformedPhotos = photosData.map((photo) => ({
        _id: photo._id,
        id: photo._id, // Keep both for compatibility
        name: photo.filename,
        filepath: photo.filepath,
        status: transformStatus(photo.status),
        progress: getProgressFromStatus(photo.status),
        fileSize: photo.fileSize || 0,
        uploadedAt: photo.createdAt,
        updatedAt: photo.updatedAt,
        events: photo.events || [],
        tags: photo.tags || [],
      }))

      // Patch update: only update photos that changed or are new - use _id for stable comparison
      setPhotos((prevPhotos) => {
        // If this is the first load and we have no previous photos, just set them
        if (prevPhotos.length === 0) {
          return transformedPhotos
        }

        const prevMap = new Map(prevPhotos.map((p) => [p._id || p.id, p]))
        const newMap = new Map(transformedPhotos.map((p) => [p._id || p.id, p]))
        
        // Check if we need to update
        let needsUpdate = false
        
        // Check for new or removed photos
        if (prevMap.size !== newMap.size) {
          needsUpdate = true
        } else {
          // Check for changed photos
          for (const [id, newPhoto] of newMap) {
            const prevPhoto = prevMap.get(id)
            if (!prevPhoto) {
              needsUpdate = true
              break
            }
            // Only update if status, progress, or updatedAt changed (skip events comparison for performance)
            if (
              prevPhoto.status !== newPhoto.status ||
              prevPhoto.progress !== newPhoto.progress ||
              prevPhoto.updatedAt !== newPhoto.updatedAt
            ) {
              needsUpdate = true
              break
            }
          }
        }

        // If no changes, return previous array to prevent re-render
        if (!needsUpdate) {
          return prevPhotos
        }

        // Merge: keep existing photos that haven't changed, update changed ones
        const merged = transformedPhotos.map((newPhoto) => {
          const photoId = newPhoto._id || newPhoto.id
          const prevPhoto = prevMap.get(photoId)
          // If photo exists and hasn't changed, keep the old reference (prevents re-render)
          if (prevPhoto && 
              prevPhoto.status === newPhoto.status &&
              prevPhoto.progress === newPhoto.progress &&
              prevPhoto.updatedAt === newPhoto.updatedAt) {
            return prevPhoto
          }
          return newPhoto
        })

        return merged
      })
      
      return transformedPhotos
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to fetch photos"
      setError(errorMessage)
      console.error("Error fetching photos:", err)
      throw err
    } finally {
      if (isInitialLoad) {
        setIsLoading(false)
      }
    }
  }, [])

  const fetchPhoto = useCallback(async (id) => {
    try {
      const photo = await getPhoto(id)
      return {
        _id: photo._id,
        id: photo._id, // Keep both for compatibility
        name: photo.filename,
        filepath: photo.filepath,
        status: transformStatus(photo.status),
        progress: getProgressFromStatus(photo.status),
        fileSize: photo.fileSize || 0,
        uploadedAt: photo.createdAt,
        updatedAt: photo.updatedAt,
        events: photo.events || [],
        tags: photo.tags || [],
      }
    } catch (err) {
      console.error("Error fetching photo:", err)
      throw err
    }
  }, [])

  const updatePhotoStatus = useCallback(async (id, status, event) => {
    try {
      const updated = await updatePhoto(id, { status, event })
      setPhotos((prev) =>
        prev.map((photo) =>
          photo.id === id
            ? {
                ...photo,
                status: transformStatus(updated.status),
                progress: getProgressFromStatus(updated.status),
                events: updated.events || [],
              }
            : photo
        )
      )
      return updated
    } catch (err) {
      console.error("Error updating photo:", err)
      throw err
    }
  }, [])

  const getDonePhotos = useCallback(() => {
    return photos.filter((photo) => photo.status === "completed")
  }, [photos])

  const getProcessingPhotos = useCallback(() => {
    return photos.filter((photo) => photo.status === "processing")
  }, [photos])

  const getPendingPhotos = useCallback(() => {
    return photos.filter((photo) => photo.status === "uploaded" || photo.status === "pending")
  }, [photos])

  const removePhotos = useCallback((ids) => {
    setPhotos((prev) => prev.filter((photo) => {
      const photoId = photo._id || photo.id
      return !ids.includes(photoId) && !ids.includes(photo.id)
    }))
  }, [])

  // Update a single photo in the list without refetching all
  const updateSinglePhoto = useCallback((id, updatedPhoto) => {
    setPhotos((prev) => prev.map((photo) => {
      const photoId = photo._id || photo.id
      if (photoId === id || photo.id === id) {
        return updatedPhoto
      }
      return photo
    }))
  }, [])

  return {
    photos,
    isLoading,
    error,
    fetchPhotos,
    fetchPhoto,
    updatePhotoStatus,
    getDonePhotos,
    getProcessingPhotos,
    getPendingPhotos,
    removePhotos,
    updateSinglePhoto,
  }
}

export default usePhotos

