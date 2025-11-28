import Card from "./Card"
import Button from "./Button"

const GalleryGridItem = ({ photo, onSelect, onDelete }) => {
  const { id, thumbnail, name, processedAt } = photo

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-square bg-gray-100">
        {thumbnail ? (
          <img src={thumbnail} alt={name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <Button size="sm" variant="default" onClick={() => onSelect?.(photo)}>
            View
          </Button>
          <Button size="sm" variant="destructive" onClick={() => onDelete?.(photo)}>
            Delete
          </Button>
        </div>
      </div>
      <div className="p-3">
        <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
        {processedAt && (
          <p className="text-xs text-gray-500 mt-1">
            {new Date(processedAt).toLocaleDateString()}
          </p>
        )}
      </div>
    </Card>
  )
}

export default GalleryGridItem

