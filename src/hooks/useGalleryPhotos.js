import { useState, useCallback, useRef } from "react"
import { getPhotos } from "../services/api"
import { transformStatus, getProgressFromStatus } from "../utils/statusMappings"

/**
 * Isolated hook for Gallery page
 * Prevents cross-page rerenders - state is isolated to this page only
 */
const useGalleryPhotos = () => {
  const [photos, setPhotos] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const hasInitialLoad = useRef(false)

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
        id: photo._id,
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

      // Patch update: only update photos that changed
      setPhotos((prevPhotos) => {
        if (prevPhotos.length === 0) {
          return transformedPhotos
        }

        const prevMap = new Map(prevPhotos.map((p) => [p._id || p.id, p]))
        const newMap = new Map(transformedPhotos.map((p) => [p._id || p.id, p]))
        
        let needsUpdate = false
        
        if (prevMap.size !== newMap.size) {
          needsUpdate = true
        } else {
          for (const [id, newPhoto] of newMap) {
            const prevPhoto = prevMap.get(id)
            if (!prevPhoto) {
              needsUpdate = true
              break
            }
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

        if (!needsUpdate) {
          return prevPhotos
        }

        // Merge: keep existing photos that haven't changed
        const merged = transformedPhotos.map((newPhoto) => {
          const photoId = newPhoto._id || newPhoto.id
          const prevPhoto = prevMap.get(photoId)
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

  const removePhotos = useCallback((ids) => {
    setPhotos((prev) => prev.filter((photo) => {
      const photoId = photo._id || photo.id
      return !ids.includes(photoId) && !ids.includes(photo.id)
    }))
  }, [])

  const getDonePhotos = useCallback(() => {
    return photos.filter((photo) => photo.status === "completed" || photo.status === "done")
  }, [photos])

  return {
    photos,
    isLoading,
    error,
    fetchPhotos,
    removePhotos,
    getDonePhotos,
    hasInitialLoad,
  }
}

export default useGalleryPhotos

