# RapidPhotoFlow Architecture

## Folder Structure

```
src/
  pages/          # Page components (layout + composition only)
  components/     # All reusable UI components (flat structure, no subfolders)
  hooks/          # Custom React hooks (business logic)
  services/       # API calls and HTTP client
  utils/          # Helpers, constants, formatters, status mappings
  assets/         # Static assets
```

## Architecture Rules

### 1. Pages (`src/pages/`)
- **Layout + composition only** - No heavy logic
- Use hooks for business logic
- Compose from reusable components
- Keep pages minimal and focused

**Pages:**
- `Upload.jsx` - Uses `useUpload()` hook
- `ProcessingQueue.jsx` - Uses `usePhotos()` + `usePolling()`
- `ReviewGallery.jsx` - Uses `usePhotos()`

### 2. Components (`src/components/`)
- **Flat structure** - No subfolders
- All reusable UI components directly in `components/`
- Presentational components only
- No business logic

**Required Components:**
- `TopNav.jsx` - Navigation bar
- `DragDropUploader.jsx` - File upload
- `PhotoCard.jsx` - Photo card display
- `StatusChip.jsx` - Status indicator
- `ProgressBar.jsx` - Progress indicator
- `EventLogItem.jsx` - Event log entry
- `GalleryGrid.jsx` - Gallery grid container
- `GalleryItem.jsx` - Gallery item
- `Modal.jsx` - Base modal
- `PageLayout.jsx` - Page wrapper
- `PageHeader.jsx` - Page header
- `Button.jsx` - Button component
- `Card.jsx` - Card component
- `Badge.jsx` - Badge component

### 3. Hooks (`src/hooks/`)
- **Business logic only** - Extract from pages
- Minimal and focused
- Reusable across pages

**Hooks:**
- `useUpload.js` - Upload logic (file handling, API calls)
- `usePhotos.js` - Photo fetching and management
- `usePolling.js` - Polling for repeating API calls

### 4. Services (`src/services/`)
- **All API calls** - Backend communication
- Centralized HTTP client

**Services:**
- `api.js` - Photo API functions
- `httpClient.js` - Axios instance configuration

### 5. Utils (`src/utils/`)
- **Helpers and constants** - Pure functions
- No business logic

**Utils:**
- `utils.js` - Utility functions (cn, etc.)
- `constants.js` - App constants
- `formatters.js` - Data formatting (file size, dates, event log)
- `statusMappings.js` - Status transformations

### 6. Styling
- **TailwindCSS only** - No external UI libraries
- No inline styles
- Consistent spacing, shadows, fonts
- Use design system tokens

## Data Flow

```
User Action → Page → Hook → Service → API
                ↓
            Component (UI Update)
```

## Microfrontend Principles

1. **Isolated Pages** - Each page is a self-contained micro-app
2. **Shared Components** - UI building blocks used across pages
3. **Business Logic Separation** - Logic in hooks, not components
4. **Clean Data Flow** - Services handle all backend communication
5. **Minimal Abstraction** - Keep it simple and readable

## Best Practices

1. Pages should be thin - only composition
2. Extract logic to hooks
3. Components are presentational only
4. All API calls through services
5. Use utils for pure functions
6. Keep code minimal and hackathon-ready
7. Avoid unnecessary nesting or abstraction

