import { useState, useCallback, useEffect, useMemo, memo, useRef } from "react"
import { useNavigate } from "react-router-dom"
import PageLayout from "../components/PageLayout"
import PhotoList from "../components/PhotoList"
import DeleteConfirmationModal from "../components/DeleteConfirmationModal"
import EventLog from "../components/EventLog"
import Button from "../components/Button"
import useQueuePhotos from "../hooks/useQueuePhotos"
import { buildEventLog } from "../utils/formatters"
import { deletePhoto, retryPhoto, deletePhotos, getPhoto } from "../services/api"
import { transformStatus, getProgressFromStatus } from "../utils/statusMappings"

// Memoized ProcessingQueue component - isolated state boundary
const ProcessingQueue = memo(() => {
  const navigate = useNavigate()
  const {
    photos,
    isLoading,
    fetchPhotos,
    getProcessingPhotos,
    getPendingPhotos,
    getDonePhotos,
    removePhotos,
    updateSinglePhoto,
    hasInitialLoad,
  } = useQueuePhotos()
  const [retryingIds, setRetryingIds] = useState(new Set())
  const [isDeleteMode, setIsDeleteMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState(new Set())
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null, count: 1 })
  const fetchPhotosRef = useRef(fetchPhotos)

  // Update ref when fetchPhotos changes
  useEffect(() => {
    fetchPhotosRef.current = fetchPhotos
  }, [fetchPhotos])

  // Fetch photos only once on initial mount - no polling, no refetch loops
  useEffect(() => {
    if (!hasInitialLoad.current) {
      hasInitialLoad.current = true
      fetchPhotosRef.current(true) // Pass true to indicate initial load
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps - only run once on mount

  // Memoize expensive computations - only recalculate when photos array changes
  const processingCount = useMemo(() => {
    return photos.filter((photo) => photo.status === "processing").length
  }, [photos])
  
  const pendingCount = useMemo(() => {
    return photos.filter((photo) => photo.status === "uploaded" || photo.status === "pending").length
  }, [photos])
  
  const completedCount = useMemo(() => {
    return photos.filter((photo) => photo.status === "completed" || photo.status === "done").length
  }, [photos])
  
  const events = useMemo(() => buildEventLog(photos), [photos])

  // Memoized handlers - prevent recreation on every render
  // Heavy async logic moved to separate function, handler is instant
  const handleRetry = useCallback((id) => {
    // Instant UI feedback - update state immediately
    setRetryingIds((prev) => new Set(prev).add(id))
    
    // Async operation in background - doesn't block UI
    Promise.resolve().then(async () => {
      try {
        await retryPhoto(id)
        const updatedPhotoData = await getPhoto(id)
        const transformedPhoto = {
          _id: updatedPhotoData._id,
          id: updatedPhotoData._id,
          name: updatedPhotoData.filename,
          filepath: updatedPhotoData.filepath,
          status: transformStatus(updatedPhotoData.status),
          progress: getProgressFromStatus(updatedPhotoData.status),
          fileSize: updatedPhotoData.fileSize || 0,
          uploadedAt: updatedPhotoData.createdAt,
          updatedAt: updatedPhotoData.updatedAt,
          events: updatedPhotoData.events || [],
          tags: updatedPhotoData.tags || [],
        }
        updateSinglePhoto(id, transformedPhoto)
      } catch (error) {
        // Error handling in background - no blocking
        setTimeout(() => {
          alert("Failed to retry photo. Please try again.")
        }, 0)
      } finally {
        setRetryingIds((prev) => {
          const next = new Set(prev)
          next.delete(id)
          return next
        })
      }
    })
  }, [updateSinglePhoto])

  const handleDelete = useCallback((id) => {
    setDeleteModal({ isOpen: true, id, count: 1 })
  }, [])

  const handleConfirmDelete = useCallback(() => {
    const id = deleteModal.id
    if (!id) return
    
    // Instant UI feedback
    setIsDeleting(true)
    setDeleteModal({ isOpen: false, id: null, count: 1 })
    
    // Async operation in background
    Promise.resolve().then(async () => {
      try {
        await deletePhoto(id)
        removePhotos([id]) // Only removes this photo, no refetch
      } catch (error) {
        // Error handling in background
        setTimeout(() => {
          alert("Failed to delete photo. Please try again.")
          setIsDeleting(false)
        }, 0)
        return
      }
      setIsDeleting(false)
    })
  }, [deleteModal.id, removePhotos])

  const handleToggleSelect = useCallback((id, checked) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (checked) {
        next.add(id)
      } else {
        next.delete(id)
      }
      return next
    })
  }, [])

  const handleBatchDelete = useCallback(() => {
    if (selectedIds.size === 0) return
    setDeleteModal({ isOpen: true, id: null, count: selectedIds.size })
  }, [selectedIds.size])

  const handleConfirmBatchDelete = useCallback(() => {
    if (selectedIds.size === 0) return

    // Capture IDs and clear UI immediately
    const idsToDelete = Array.from(selectedIds)
    setIsDeleting(true)
    setIsDeleteMode(false)
    setSelectedIds(new Set())
    setDeleteModal({ isOpen: false, id: null, count: 1 })
    
    // Async operation in background
    Promise.resolve().then(async () => {
      try {
        await deletePhotos(idsToDelete)
        removePhotos(idsToDelete) // Only removes deleted photos
      } catch (error) {
        // Error handling in background
        setTimeout(() => {
          alert("Failed to delete some photos. Please try again.")
        }, 0)
      } finally {
        setIsDeleting(false)
      }
    })
  }, [selectedIds, removePhotos])

  const handleExitDeleteMode = useCallback(() => {
    setIsDeleteMode(false)
    setSelectedIds(new Set())
  }, [])

  // Memoized navigation handlers - prevent recreation
  const handleNavigateToGallery = useCallback(() => {
    navigate("/gallery")
  }, [navigate])

  const handleNavigateToUpload = useCallback(() => {
    navigate("/upload")
  }, [navigate])

  const handleEnterDeleteMode = useCallback(() => {
    setIsDeleteMode(true)
  }, [])

  // Memoized modal handlers - lightweight local state only
  const handleCloseModal = useCallback(() => {
    setDeleteModal({ isOpen: false, id: null, count: 1 })
  }, [])

  return (
    <PageLayout>
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-[22px] font-medium title-gradient mb-2">
              Processing Queue
            </h1>
            <p className="text-base sm:text-lg text-gray-600">
              {processingCount} processing · {pendingCount} pending · {completedCount} completed
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isDeleteMode ? (
              <Button onClick={handleExitDeleteMode} variant="outline" size="lg">
                Cancel
              </Button>
            ) : (
              <>
                <button
                  onClick={handleEnterDeleteMode}
                  className="p-2 rounded-lg border border-gray-300"
                  aria-label="Delete mode"
                  title="Delete mode"
                >
                  <svg
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
                <Button onClick={handleNavigateToGallery} variant="outline" size="lg">
                  View Gallery
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Photos in Queue
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {photos.length} {photos.length === 1 ? "photo" : "photos"}
              </p>
            </div>
            <div className="p-4 sm:p-6">
              {isLoading && photos.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <p className="text-gray-500">Loading photos...</p>
                </div>
              ) : photos.length > 0 ? (
                <PhotoList
                  photos={photos}
                  onRetry={handleRetry}
                  onDelete={handleDelete}
                  isSelectMode={isDeleteMode}
                  selectedIds={selectedIds}
                  onToggleSelect={handleToggleSelect}
                  showRetry={true}
                  showMenu={true}
                  showStatusBadge={true}
                />
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <svg
                    className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4"
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
                  <p className="text-gray-500 mb-4">No photos in queue</p>
                  <Button onClick={handleNavigateToUpload}>Upload Photos</Button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <EventLog events={events} />
        </div>
      </div>

      {/* Floating Delete Bar */}
      {isDeleteMode && selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-50 p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {selectedIds.size} {selectedIds.size === 1 ? "photo" : "photos"} selected
            </span>
            <div className="flex items-center gap-3">
              <Button
                onClick={handleExitDeleteMode}
                variant="outline"
                size="sm"
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBatchDelete}
                variant="default"
                size="sm"
                disabled={isDeleting}
                className="bg-red-600 text-white"
              >
                Delete Selected
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseModal}
        onConfirm={deleteModal.id ? handleConfirmDelete : handleConfirmBatchDelete}
        count={deleteModal.count}
        isDeleting={isDeleting}
      />
    </PageLayout>
  )
})

ProcessingQueue.displayName = "ProcessingQueue"

export default ProcessingQueue
