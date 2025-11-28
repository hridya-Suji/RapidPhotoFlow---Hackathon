# RapidPhotoFlow Design System

## Core Principles

- **TailwindCSS Only**: No external UI libraries (MUI, Chakra, Bootstrap, ShadCN)
- **Consistent Spacing**: Use `p-4`, `p-6`, `gap-4`, `gap-6` throughout
- **Rounded Corners**: `rounded-lg` (10px) or `rounded-xl` (12px)
- **Soft Shadows**: `shadow-sm` or `shadow-md` only
- **Gray Palette**: `gray-100`, `gray-200`, `gray-600`, `gray-800`
- **Subtle Borders**: `border border-gray-200`
- **Transitions**: `transition-all duration-200` for hover effects
- **Typography**: Inter font or system default

## Component Library

All components are located in `src/components/`:

### Core UI Components (`src/components/ui/`)
- **Button**: Variants (default, outline, ghost, destructive), sizes (sm, default, lg)
- **Card**: Base card with Header, Title, Content subcomponents
- **Badge**: Status indicators with color variants
- **Progress**: Progress bar component

### Layout Components
- **TopNav**: Navigation bar with active state
- **PageLayout**: Wrapper for all pages
- **PageHeader**: Consistent page headers
- **GridContainer**: Responsive grid layouts

### Feature Components
- **StatusChip**: Status badges (Uploaded, Processing, Completed, Pending)
- **ProgressBar**: Progress indicators with labels
- **PhotoCard**: Photo thumbnail cards
- **GalleryItem**: Gallery grid items with hover effects
- **Modal**: Reusable modal component
- **EventLogItem**: Event log entries
- **QueueCard**: Processing queue cards
- **UploadedFileCard**: Uploaded file list items

## Spacing System

```css
Padding: p-4 (16px) or p-6 (24px)
Gaps: gap-4 (16px) or gap-6 (24px)
Margins: mb-4, mb-6, mt-4, mt-6
```

## Color Palette

```css
Backgrounds: bg-white, bg-gray-50, bg-gray-100
Borders: border-gray-200
Text: text-gray-600, text-gray-800, text-gray-900
Status Colors:
  - Success: green-100, green-600, green-800
  - Processing: orange-100, orange-500, orange-800
  - Pending: gray-100, gray-300, gray-600
  - Error: red-100, red-600, red-800
```

## Typography

```css
Headings:
  - h1: text-2xl sm:text-3xl font-bold
  - h2: text-xl sm:text-2xl font-semibold
  - h3: text-lg sm:text-xl font-semibold

Body:
  - Default: text-sm text-gray-600
  - Small: text-xs text-gray-500
  - Large: text-base sm:text-lg
```

## Responsive Breakpoints

```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
```

## Component Usage Examples

### Button
```jsx
<Button variant="default" size="lg">Click me</Button>
<Button variant="outline" size="sm">Cancel</Button>
```

### Card
```jsx
<Card>
  <Card.Header>
    <Card.Title>Title</Card.Title>
  </Card.Header>
  <Card.Content>
    Content here
  </Card.Content>
</Card>
```

### GridContainer
```jsx
<GridContainer cols="auto">
  {items.map(item => <Item key={item.id} />)}
</GridContainer>
```

## Rules to Follow

✅ **DO:**
- Use Tailwind classes only
- Keep components small and reusable
- Use consistent spacing (p-4, p-6, gap-4, gap-6)
- Use rounded-lg or rounded-xl
- Use shadow-sm or shadow-md
- Use transition-all duration-200
- Match Figma designs exactly

❌ **DON'T:**
- Use inline styles
- Use external UI libraries
- Hard-code styles
- Repeat component logic
- Deep nesting
- Use custom CSS files

