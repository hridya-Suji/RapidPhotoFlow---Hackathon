# RapidPhotoFlow API Documentation

## Base URL
- Development: `http://localhost:3000`
- Endpoints: `/photos` or `/api/photos`

## Photo Model

```javascript
{
  _id: ObjectId,
  filename: String,        // Stored filename
  filepath: String,        // URL path: "/uploads/filename"
  status: String,          // "uploaded" | "processing" | "done"
  events: [                // Array of event objects
    {
      timestamp: Date,
      message: String
    }
  ],
  createdAt: Date,          // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

## Endpoints

### POST /photos
Upload multiple images.

**Request:**
- Method: `POST`
- Content-Type: `multipart/form-data`
- Body: Form data with field name `photos` (array of files)
- Max files: 10
- Max file size: 10MB
- Allowed types: JPEG, JPG, PNG, WEBP

**Response:**
```json
[
  {
    "_id": "...",
    "filename": "photos-1234567890-123456789.jpg",
    "filepath": "/uploads/photos-1234567890-123456789.jpg",
    "status": "uploaded",
    "events": [
      {
        "timestamp": "2024-01-01T00:00:00.000Z",
        "message": "photo.jpg uploaded successfully"
      }
    ],
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
]
```

**Error Responses:**
- `400`: No files uploaded, invalid file type, file too large
- `500`: Server error

---

### GET /photos
Get all photos sorted by createdAt descending.

**Request:**
- Method: `GET`
- Query params: None

**Response:**
```json
[
  {
    "_id": "...",
    "filename": "...",
    "filepath": "/uploads/...",
    "status": "uploaded",
    "events": [...],
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

**Error Responses:**
- `500`: Server error

---

### GET /photos/:id
Get single photo with events.

**Request:**
- Method: `GET`
- Params: `id` (MongoDB ObjectId)

**Response:**
```json
{
  "_id": "...",
  "filename": "...",
  "filepath": "/uploads/...",
  "status": "processing",
  "events": [
    {
      "timestamp": "2024-01-01T00:00:00.000Z",
      "message": "photo.jpg uploaded successfully"
    },
    {
      "timestamp": "2024-01-01T00:01:00.000Z",
      "message": "Processing started"
    }
  ],
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Error Responses:**
- `400`: Invalid photo ID
- `404`: Photo not found
- `500`: Server error

---

### PUT /photos/:id
Update photo status or append event to events array.

**Request:**
- Method: `PUT`
- Params: `id` (MongoDB ObjectId)
- Body: JSON
  ```json
  {
    "status": "processing",  // Optional: "uploaded" | "processing" | "done"
    "event": {               // Optional: Append new event
      "message": "Processing started",
      "timestamp": "2024-01-01T00:00:00.000Z"  // Optional, defaults to now
    }
  }
  ```

**Response:**
```json
{
  "_id": "...",
  "filename": "...",
  "filepath": "/uploads/...",
  "status": "processing",
  "events": [...],
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Error Responses:**
- `400`: Invalid status, invalid event format, invalid photo ID
- `404`: Photo not found
- `500`: Server error

---

### DELETE /photos/:id
Delete photo and its file.

**Request:**
- Method: `DELETE`
- Params: `id` (MongoDB ObjectId)

**Response:**
```json
{
  "message": "Photo deleted successfully"
}
```

**Error Responses:**
- `400`: Invalid photo ID
- `404`: Photo not found
- `500`: Server error

---

## Example Usage

### Upload Photos
```javascript
const formData = new FormData()
formData.append('photos', file1)
formData.append('photos', file2)

fetch('http://localhost:3000/photos', {
  method: 'POST',
  body: formData
})
```

### Get All Photos
```javascript
fetch('http://localhost:3000/photos')
  .then(res => res.json())
  .then(photos => console.log(photos))
```

### Get Photo by ID
```javascript
fetch('http://localhost:3000/photos/507f1f77bcf86cd799439011')
  .then(res => res.json())
  .then(photo => console.log(photo))
```

### Update Photo Status
```javascript
fetch('http://localhost:3000/photos/507f1f77bcf86cd799439011', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'processing'
  })
})
```

### Append Event
```javascript
fetch('http://localhost:3000/photos/507f1f77bcf86cd799439011', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: {
      message: 'Processing started'
    }
  })
})
```

### Update Status and Append Event
```javascript
fetch('http://localhost:3000/photos/507f1f77bcf86cd799439011', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    status: 'done',
    event: {
      message: 'Processing completed successfully'
    }
  })
})
```

