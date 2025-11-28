import { memo, useMemo } from "react"
import PhotoCard from "./PhotoCard"

/**
 * Memoized photo list component - prevents rerenders when individual items change
 * Only rerenders when the photos array reference changes or specific props change
 */
const PhotoList = memo(({ 
  photos, 
  onRetry, 
  onDelete, 
  onView,
  isSelectMode, 
  selectedIds, 
  onToggleSelect,
  showRetry,
  showMenu,
  showStatusBadge,
  showViewButton,
}) => {
  // Memoize the photo list to prevent recreation
  const photoItems = useMemo(() => {
    return photos.map((photo) => {
      const photoId = photo._id || photo.id
      return (
        <PhotoCard
          key={photoId}
          photo={photo}
          onRetry={onRetry}
          onDelete={onDelete}
          onView={onView}
          isSelectMode={isSelectMode}
          isSelected={selectedIds?.has(photoId) || false}
          onToggleSelect={onToggleSelect}
          showRetry={showRetry}
          showMenu={showMenu}
          showStatusBadge={showStatusBadge}
          showViewButton={showViewButton}
        />
      )
    })
  }, [
    photos,
    onRetry,
    onDelete,
    onView,
    isSelectMode,
    selectedIds,
    onToggleSelect,
    showRetry,
    showMenu,
    showStatusBadge,
    showViewButton,
  ])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" style={{ gridAutoRows: "min-content" }}>
      {photoItems}
    </div>
  )
}, (prevProps, nextProps) => {
  // Only rerender if photos array reference changes or key props change
  // Check if photos array length or content changed
  if (prevProps.photos.length !== nextProps.photos.length) {
    return false
  }
  
  // Check if any photo IDs changed
  const prevIds = new Set(prevProps.photos.map(p => p._id || p.id))
  const nextIds = new Set(nextProps.photos.map(p => p._id || p.id))
  if (prevIds.size !== nextIds.size || [...prevIds].some(id => !nextIds.has(id))) {
    return false
  }
  
  // Check other props
  return (
    prevProps.isSelectMode === nextProps.isSelectMode &&
    prevProps.selectedIds === nextProps.selectedIds &&
    prevProps.showRetry === nextProps.showRetry &&
    prevProps.showMenu === nextProps.showMenu &&
    prevProps.showStatusBadge === nextProps.showStatusBadge &&
    prevProps.showViewButton === nextProps.showViewButton &&
    prevProps.onRetry === nextProps.onRetry &&
    prevProps.onDelete === nextProps.onDelete &&
    prevProps.onView === nextProps.onView &&
    prevProps.onToggleSelect === nextProps.onToggleSelect
  )
})

PhotoList.displayName = "PhotoList"

export default PhotoList

