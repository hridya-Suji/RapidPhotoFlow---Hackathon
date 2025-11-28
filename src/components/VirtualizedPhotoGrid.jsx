import { useState, useEffect, useRef, useMemo, memo } from "react"

/**
 * Lightweight virtualization for photo grid
 * Only renders photos visible in viewport + buffer
 * Reduces initial render time and memory usage
 */
const VirtualizedPhotoGrid = memo(({ 
  photos, 
  renderItem,
  itemHeight = 250, // Approximate height of photo card
  columns = 6, // Default columns
  gap = 16, // Gap between items
  overscan = 3, // Number of rows to render outside viewport
}) => {
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: Math.min(20, photos.length) })
  const containerRef = useRef(null)
  const observerRef = useRef(null)

  // Calculate rows based on columns
  const rows = useMemo(() => {
    return Math.ceil(photos.length / columns)
  }, [photos.length, columns])

  // Calculate which items are visible
  useEffect(() => {
    if (!containerRef.current || photos.length === 0) return

    const container = containerRef.current
    const containerTop = container.scrollTop
    const containerHeight = container.clientHeight
    
    // Calculate row height (item height + gap)
    const rowHeight = itemHeight + gap
    
    // Find visible rows
    const startRow = Math.max(0, Math.floor(containerTop / rowHeight) - overscan)
    const endRow = Math.min(rows - 1, Math.ceil((containerTop + containerHeight) / rowHeight) + overscan)
    
    // Calculate visible item indices
    const start = startRow * columns
    const end = Math.min(photos.length, (endRow + 1) * columns)
    
    setVisibleRange({ start, end })
  }, [photos.length, columns, itemHeight, gap, overscan, rows])

  // Set up scroll listener
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const containerTop = container.scrollTop
      const containerHeight = container.clientHeight
      const rowHeight = itemHeight + gap
      
      const startRow = Math.max(0, Math.floor(containerTop / rowHeight) - overscan)
      const endRow = Math.min(rows - 1, Math.ceil((containerTop + containerHeight) / rowHeight) + overscan)
      
      const start = startRow * columns
      const end = Math.min(photos.length, (endRow + 1) * columns)
      
      setVisibleRange({ start, end })
    }

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [photos.length, columns, itemHeight, gap, overscan, rows])

  // Render visible items
  const visibleItems = useMemo(() => {
    return photos.slice(visibleRange.start, visibleRange.end).map((photo, index) => {
      const actualIndex = visibleRange.start + index
      return (
        <div key={photo._id || photo.id} style={{ gridColumn: 'span 1' }}>
          {renderItem(photo, actualIndex)}
        </div>
      )
    })
  }, [photos, visibleRange, renderItem])

  // Calculate spacer heights
  const topSpacerHeight = visibleRange.start * (itemHeight + gap) / columns
  const bottomSpacerHeight = (photos.length - visibleRange.end) * (itemHeight + gap) / columns

  if (photos.length === 0) {
    return null
  }

  // For small lists (< 30 items), render all items without virtualization
  if (photos.length < 30) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4" style={{ gridAutoRows: "min-content" }}>
        {photos.map((photo, index) => (
          <div key={photo._id || photo.id}>
            {renderItem(photo, index)}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div 
      ref={containerRef}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4"
      style={{ 
        gridAutoRows: "min-content",
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {topSpacerHeight > 0 && (
        <div style={{ height: topSpacerHeight, gridColumn: '1 / -1' }} />
      )}
      {visibleItems}
      {bottomSpacerHeight > 0 && (
        <div style={{ height: bottomSpacerHeight, gridColumn: '1 / -1' }} />
      )}
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    prevProps.photos === nextProps.photos &&
    prevProps.itemHeight === nextProps.itemHeight &&
    prevProps.columns === nextProps.columns &&
    prevProps.gap === nextProps.gap
  )
})

VirtualizedPhotoGrid.displayName = "VirtualizedPhotoGrid"

export default VirtualizedPhotoGrid

