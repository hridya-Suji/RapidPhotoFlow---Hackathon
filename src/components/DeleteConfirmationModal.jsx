import { useEffect, memo } from "react"
import { cn } from "../utils/utils"

const DeleteConfirmationModal = memo(({ 
  isOpen, 
  onClose, 
  onConfirm, 
  count = 1,
  isDeleting = false 
}) => {
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

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
      style={{ animation: "fadeIn 0.2s ease-out" }}
    >
      <div
        className="bg-white rounded-xl shadow-xl p-6 max-w-sm w-full mx-4"
        onClick={(e) => e.stopPropagation()}
        style={{ animation: "slideUp 0.2s ease-out" }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Confirm Delete
        </h3>
        <p className="text-sm text-gray-600 mb-6">
          {count === 1
            ? "Are you sure you want to delete this photo?"
            : `Are you sure you want to delete ${count} photos?`}
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    prevProps.isOpen === nextProps.isOpen &&
    prevProps.count === nextProps.count &&
    prevProps.isDeleting === nextProps.isDeleting &&
    prevProps.onClose === nextProps.onClose &&
    prevProps.onConfirm === nextProps.onConfirm
  )
})

DeleteConfirmationModal.displayName = "DeleteConfirmationModal"

export default DeleteConfirmationModal

