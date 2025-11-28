# RapidPhotoFlow Project Structure

## Folder Structure

```
src/
  pages/          # Page components (layout and composition only)
  components/     # All reusable UI components (flat structure)
  services/       # API calls and HTTP client
  hooks/          # Custom React hooks (business logic)
  utils/          # Helpers, constants, formatters
  assets/         # Static assets (images, fonts, etc.)
```

## Rules

### 1. Components (`src/components/`)
- **Flat structure**: All components directly in `components/` (no subfolders)
- **Reusable UI components only**: TopNav, Button, Card, Badge, Progress, StatusChip, etc.
- **No business logic**: Components should be presentational only
- **TailwindCSS only**: No inline styles, no external UI libraries

**Components:**
- `Button.jsx` - Button component with variants
- `Card.jsx` - Card with Header, Title, Content
- `Badge.jsx` - Badge component
- `Progress.jsx` - Progress bar
- `TopNav.jsx` - Navigation bar
- `PageLayout.jsx` - Page wrapper
- `PageHeader.jsx` - Page header
- `StatBadge.jsx` - Stat badge
- `StatusChip.jsx` - Status chip
- `ProgressBar.jsx` - Progress bar wrapper
- `PhotoCard.jsx` - Photo card
- `GalleryItem.jsx` - Gallery item
- `EventLogItem.jsx` - Event log item
- `QueueCard.jsx` - Queue card
- `UploadedFileCard.jsx` - Uploaded file card
- `DragDropUploader.jsx` - Drag and drop uploader
- `Modal.jsx` - Base modal
- `PhotoModal.jsx` - Photo modal
- `EventLog.jsx` - Event log container
- `GalleryGrid.jsx` - Gallery grid
- `GridContainer.jsx` - Grid container

### 2. Pages (`src/pages/`)
- **Layout and composition only**: No heavy UI or business logic
- **Use components**: Compose pages from reusable components
- **Minimal logic**: Only page-specific state and navigation

**Pages:**
- `Upload.jsx` - Upload photos page
- `ProcessingQueue.jsx` - Processing queue page
- `ReviewGallery.jsx` - Review gallery page

### 3. Services (`src/services/`)
- **API calls only**: All API communication goes through services
- **httpClient.js**: Axios instance with interceptors
- **api.js**: API functions using httpClient

**Files:**
- `httpClient.js` - Axios instance with auth and error handling
- `api.js` - API functions (uploadPhotos, getPhotos, etc.)

### 4. Hooks (`src/hooks/`)
- **Business logic**: All business logic belongs in custom hooks
- **Reusable**: Hooks should be reusable across pages
- **Separation of concerns**: Keep logic separate from UI

**Example hooks:**
- `usePhotos.js` - Photo management logic
- `useUpload.js` - Upload logic
- `useProcessing.js` - Processing logic

### 5. Utils (`src/utils/`)
- **Helpers**: Utility functions
- **Constants**: App constants
- **Formatters**: Data formatting functions

**Files:**
- `utils.js` - Utility functions (cn, etc.)
- `formatters.js` - Data formatting (dates, file sizes, etc.)
- `constants.js` - App constants

### 6. Assets (`src/assets/`)
- **Static files**: Images, fonts, icons
- **Organized**: Keep assets organized by type

## Import Patterns

### Components
```jsx
import Button from "../components/Button"
import Card from "../components/Card"
```

### Services
```jsx
import { uploadPhotos, getPhotos } from "../services/api"
```

### Utils
```jsx
import { cn } from "../utils/utils"
import { formatFileSize } from "../utils/formatters"
```

### Hooks
```jsx
import { usePhotos } from "../hooks/usePhotos"
```

## Best Practices

1. **No nested component folders**: All components in `components/` root
2. **Pages are thin**: Only composition, no heavy logic
3. **API calls through services**: Never call axios directly in components
4. **Business logic in hooks**: Extract logic from components
5. **TailwindCSS only**: No inline styles or external UI libraries
6. **Consistent naming**: PascalCase for components, camelCase for utilities
7. **Keep it minimal**: Small, focused, reusable components

