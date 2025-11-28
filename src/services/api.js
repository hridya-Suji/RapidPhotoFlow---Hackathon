import httpClient from "./httpClient"

// Upload photo(s) - single POST request with all files in FormData
// Handles large batches (20-50 photos) without blocking UI
export const uploadPhoto = async (formData, onProgress) => {
  const response = await httpClient.post("/photos", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    timeout: 300000, // 5 minutes for very large uploads (50+ photos, slow connections)
    maxContentLength: Infinity, // No limit on response size
    maxBodyLength: Infinity,    // No limit on request body size
    // Lightweight progress tracking - non-blocking
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        // Calculate progress percentage (0-100)
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        )
        // Call progress callback (lightweight, non-blocking)
        onProgress(percentCompleted)
      }
    },
  })
  return response.data
}

// Get all photos
export const getPhotos = async () => {
  const response = await httpClient.get("/photos")
  return response.data
}

// Get photo by ID
export const getPhoto = async (id) => {
  const response = await httpClient.get(`/photos/${id}`)
  return response.data
}

// Update photo
export const updatePhoto = async (id, data) => {
  const response = await httpClient.put(`/photos/${id}`, data)
  return response.data
}

// Delete photo
export const deletePhoto = async (id) => {
  const response = await httpClient.delete(`/photos/${id}`)
  return response.data
}

// Retry photo processing
export const retryPhoto = async (id) => {
  const response = await httpClient.post(`/photos/retry/${id}`)
  return response.data
}

// Delete multiple photos
export const deletePhotos = async (ids) => {
  const response = await httpClient.post("/photos/delete-many", { ids })
  return response.data
}

export default {
  uploadPhoto,
  getPhotos,
  getPhoto,
  updatePhoto,
  deletePhoto,
  retryPhoto,
  deletePhotos,
}
