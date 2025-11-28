import express from "express"
import upload from "../middleware/upload.js"
import {
  uploadPhotos,
  getPhotos,
  getPhotoById,
  updatePhoto,
  deletePhoto,
  retryPhoto,
  deleteManyPhotos,
} from "../controllers/photoController.js"

const router = express.Router()

// POST /photos - Upload multiple images (unlimited files)
// Uses diskStorage for immediate disk writes (not buffered in memory)
// No file count limit - supports large batches (100+ photos)
router.post("/", upload.array("photos"), uploadPhotos)

// GET /photos - Get all photos sorted by createdAt desc
router.get("/", getPhotos)

// GET /photos/:id - Get single photo with events
router.get("/:id", getPhotoById)

// PUT /photos/:id - Update status or append event
router.put("/:id", updatePhoto)

// DELETE /photos/:id - Delete photo (optional)
router.delete("/:id", deletePhoto)

// POST /photos/retry/:id - Retry processing a photo
router.post("/retry/:id", retryPhoto)

// POST /photos/delete-many - Delete multiple photos
router.post("/delete-many", deleteManyPhotos)

export default router
