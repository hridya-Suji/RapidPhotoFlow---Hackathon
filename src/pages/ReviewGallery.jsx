import { useState, useEffect, useCallback, useMemo, memo, useRef } from "react"
import { useNavigate } from "react-router-dom"
import PageLayout from "../components/PageLayout"
import PageHeader from "../components/PageHeader"
import StatBadge from "../components/StatBadge"
import PhotoList from "../components/PhotoList"
import DeleteConfirmationModal from "../components/DeleteConfirmationModal"
import PhotoModal from "../components/PhotoModal"
import Button from "../components/Button"
import useGalleryPhotos from "../hooks/useGalleryPhotos"
import { deletePhoto } from "../services/api"

// Memoized ReviewGallery component - isolated state boundary
const ReviewGallery = memo(() => {
  const navigate = useNavigate()
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null)
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: null })
  const [isDeleting, setIsDeleting] = useState(false)
  const { photos, isLoading, fetchPhotos, getDonePhotos, removePhotos, hasInitialLoad } = useGalleryPhotos()
  const fetchPhotosRef = useRef(fetchPhotos)

  // Update ref when fetchPhotos changes
  useEffect(() => {
    fetchPhotosRef.current = fetchPhotos
  }, [fetchPhotos])

  // Lazy load - only fetch once on initial mount, no refetch loops
  useEffect(() => {
    if (!hasInitialLoad.current) {
      hasInitialLoad.current = true
      fetchPhotosRef.current(true) // Pass true to indicate initial load
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Empty deps - only run once on mount

  // Memoize donePhotos - only recalculate when photos array changes
  const donePhotos = useMemo(() => {
    return photos
      .filter((photo) => photo.status === "completed" || photo.status === "done")
      .map((photo) => ({
        ...photo,
        thumbnail: photo.filepath,
        processedAt: photo.updatedAt || photo.uploadedAt,
      }))
  }, [photos])

  // Memoized handlers - prevent recreation on every render
  const handleViewPhoto = useCallback((photo) => {
    const index = donePhotos.findIndex((p) => p.id === photo.id)
    setSelectedPhotoIndex(index)
  }, [donePhotos])

  const handleCloseModal = useCallback(() => {
    setSelectedPhotoIndex(null)
  }, [])

  const handleNextPhoto = useCallback(() => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex < donePhotos.length - 1) {
      setSelectedPhotoIndex(selectedPhotoIndex + 1)
    }
  }, [selectedPhotoIndex, donePhotos.length])

  const handlePreviousPhoto = useCallback(() => {
    if (selectedPhotoIndex !== null && selectedPhotoIndex > 0) {
      setSelectedPhotoIndex(selectedPhotoIndex - 1)
    }
  }, [selectedPhotoIndex])

  const selectedPhoto = useMemo(() => {
    return selectedPhotoIndex !== null ? donePhotos[selectedPhotoIndex] : null
  }, [selectedPhotoIndex, donePhotos])

  const handleDelete = useCallback((id) => {
    setDeleteModal({ isOpen: true, id })
  }, [])

  const handleConfirmDelete = useCallback(() => {
    const id = deleteModal.id
    if (!id) return
    
    // Instant UI feedback
    setIsDeleting(true)
    setDeleteModal({ isOpen: false, id: null })
    
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

  // Memoized navigation handlers
  const handleNavigateToUpload = useCallback(() => {
    navigate("/upload")
  }, [navigate])

  const handleNavigateToProcessing = useCallback(() => {
    navigate("/processing")
  }, [navigate])

  // Memoized modal close handler
  const handleCloseDeleteModal = useCallback(() => {
    setDeleteModal({ isOpen: false, id: null })
  }, [])

  return (
    <PageLayout>
      <PageHeader
        title="Review Gallery"
        description="Browse and manage your processed photos"
        actions={
          <>
            <Button
              onClick={handleNavigateToUpload}
              variant="outline"
              size="lg"
            >
              Upload More
            </Button>
            <Button
              onClick={handleNavigateToProcessing}
              variant="outline"
              size="lg"
            >
              Processing Queue
            </Button>
          </>
        }
      />

      <div className="mb-6 sm:mb-8 flex gap-4">
        <StatBadge label="Total Photos" value={donePhotos.length} />
      </div>

      <div className="mb-6 sm:mb-8">
        {isLoading && photos.length === 0 ? (
          <div className="text-center py-8 sm:py-12">
            <p className="text-gray-500">Loading gallery...</p>
          </div>
        ) : donePhotos.length > 0 ? (
          <PhotoList
            photos={donePhotos}
            onView={handleViewPhoto}
            onDelete={handleDelete}
            showMenu={true}
            showStatusBadge={false}
            showViewButton={true}
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
            <p className="text-gray-500 mb-4">No processed photos yet</p>
            <Button onClick={handleNavigateToUpload}>Upload Photos</Button>
          </div>
        )}
      </div>

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          isOpen={selectedPhotoIndex !== null}
          onClose={handleCloseModal}
          onNext={handleNextPhoto}
          onPrevious={handlePreviousPhoto}
          hasNext={selectedPhotoIndex !== null && selectedPhotoIndex < donePhotos.length - 1}
          hasPrevious={selectedPhotoIndex !== null && selectedPhotoIndex > 0}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        count={1}
        isDeleting={isDeleting}
      />
    </PageLayout>
  )
})

ReviewGallery.displayName = "ReviewGallery"

export default ReviewGallery
