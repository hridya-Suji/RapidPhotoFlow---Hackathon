import { useCallback, memo } from "react"
import { useNavigate } from "react-router-dom"
import PageLayout from "../components/PageLayout"
import PageHeader from "../components/PageHeader"
import DragDropUploader from "../components/DragDropUploader"
import UploadedFileCard from "../components/UploadedFileCard"
import Button from "../components/Button"
import useUpload from "../hooks/useUpload"

// Memoized Upload component - isolated state boundary
const Upload = memo(() => {
  const navigate = useNavigate()
  const { uploadedPhotos, isUploading, uploadProgress, error, handleUpload, removePhoto } = useUpload()

  // Memoized handlers - prevent recreation on every render
  const handleFilesSelected = useCallback(async (files) => {
    try {
      await handleUpload(files)
      // Immediately navigate to Processing Queue after successful upload
      // Do NOT wait for worker updates - they happen in background
      navigate("/processing")
    } catch (err) {
      // Only show alert if there's an error - don't navigate on error
      alert(error || "Failed to upload photos")
    }
  }, [handleUpload, navigate, error])

  const handleStartProcessing = useCallback(() => {
    if (uploadedPhotos.length > 0) {
      navigate("/processing")
    }
  }, [uploadedPhotos.length, navigate])

  return (
    <PageLayout>
      <PageHeader
        title="Upload Photos"
        description="Select or drag and drop your photos to get started"
      />

      <div className="mb-6 sm:mb-8">
        <DragDropUploader
          onFilesSelected={handleFilesSelected}
          disabled={isUploading}
        />
      </div>

      {isUploading && (
        <div className="mb-4 text-center">
          <div className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <p className="text-sm font-medium text-gray-700">Uploading photos...</p>
          </div>
          {/* Lightweight progress indicator - only shows if progress > 0 */}
          {uploadProgress > 0 && (
            <div className="mt-2 w-full max-w-xs mx-auto">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5">
                <div
                  className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}
          <p className="text-xs text-gray-500 mt-2">
            Please wait, this may take a moment for large batches
          </p>
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {uploadedPhotos.length > 0 && (
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Uploaded Files ({uploadedPhotos.length})
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {uploadedPhotos.map((photo) => (
              <UploadedFileCard
                key={photo.id}
                photo={photo}
                onRemove={removePhoto}
              />
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button
              onClick={handleStartProcessing}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isUploading}
            >
              Start Processing
            </Button>
          </div>
        </div>
      )}

      {uploadedPhotos.length === 0 && !isUploading && (
        <div className="text-center py-8 sm:py-12">
          <p className="text-gray-500 text-sm sm:text-base">
            No photos uploaded yet. Drag and drop or browse to get started.
          </p>
        </div>
      )}
    </PageLayout>
  )
})

Upload.displayName = "Upload"

export default Upload
