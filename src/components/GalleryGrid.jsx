import GalleryItem from "./GalleryItem"
import { cn } from "../utils/utils"

const GalleryGrid = ({ photos = [], onView, className, columns = "auto" }) => {
  if (photos.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="w-20 h-20 text-gray-400 mx-auto mb-4"
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
        <p className="text-gray-500 text-lg mb-2">No photos in gallery</p>
        <p className="text-gray-400 text-sm">Upload photos to get started</p>
      </div>
    )
  }

  const gridCols = {
    auto: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6",
  }

  return (
    <div
      className={cn(
        "grid gap-4",
        typeof columns === "string" ? gridCols[columns] || gridCols.auto : gridCols.auto,
        className
      )}
      style={{ gridAutoRows: "min-content" }}
    >
      {photos.map((photo) => (
        <GalleryItem key={photo.id} photo={photo} onView={onView} className="w-full" />
      ))}
    </div>
  )
}

export default GalleryGrid

