import Photo from "../models/Photo.js"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"
import { addJob } from "../queue/photoQueue.js"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// POST /photos - Upload multiple images
// Optimized to respond in <2 seconds for any batch size (20-50 photos)
// ALL OPERATIONS ARE NON-BLOCKING:
// - Parallel DB saves using Promise.all (async I/O)
// - Queue jobs are fire-and-forget (not awaited)
// - No synchronous file operations in request handler
// - No blocking loops or synchronous I/O
// - Response sent immediately after DB operations complete
export const uploadPhotos = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "No files uploaded" })
    }

    const startTime = Date.now()
    const fileCount = req.files.length
    
    // Log asynchronously to avoid blocking (setImmediate yields to event loop)
    setImmediate(() => {
      console.log(`📤 Processing ${fileCount} photo(s)...`)
    })

    // Process uploads in parallel using Promise.all for async I/O
    // All operations are non-blocking:
    // - Photo document creation (in-memory, instant)
    // - DB save (async I/O, non-blocking)
    // - Queue job addition (fire-and-forget, not awaited)
    // This ensures response time <2 seconds even for 50 photos
    const photos = await Promise.all(
      req.files.map(async (file) => {
        // Create photo document (in-memory operation - instant, non-blocking)
        const photo = new Photo({
          filename: file.filename,
          filepath: `/uploads/${file.filename}`,
          fileSize: file.size,
          status: "uploaded",
          events: [
            {
              timestamp: new Date(), // Date creation is instant
              message: `${file.originalname} uploaded successfully`,
            },
          ],
        })
        
        // Save to database (async I/O - non-blocking, yields to event loop)
        const savedPhoto = await photo.save()
        
        // Add job to Redis queue (fire-and-forget - don't await)
        // photoQueue.add() is non-blocking - Redis operations are async
        // Errors are caught and logged but don't affect the upload response
        // This operation runs in background and doesn't block the response
        addJob(savedPhoto._id).catch((error) => {
          // Log error asynchronously to avoid blocking
          setImmediate(() => {
            console.error(`Failed to add job for photo ${savedPhoto._id}:`, error)
          })
          // Queue failure doesn't affect the upload response
        })
        
        return savedPhoto
      })
    )

    // Calculate duration (instant operation)
    const duration = Date.now() - startTime
    
    // Log asynchronously to avoid blocking response
    setImmediate(() => {
      console.log(`✅ Uploaded ${photos.length} photo(s) in ${duration}ms`)
    })
    
    // Respond immediately - all blocking operations are complete
    // Queue processing happens in background (worker handles it)
    // JSON serialization is fast and non-blocking for this data size
    res.status(201).json(photos)
  } catch (error) {
    // Log error asynchronously
    setImmediate(() => {
      console.error("Upload error:", error)
    })
    // Respond with error (non-blocking)
    res.status(500).json({ error: "Failed to upload photos", details: error.message })
  }
}

// GET /photos - Get all photos sorted by createdAt desc
export const getPhotos = async (req, res) => {
  try {
    const photos = await Photo.find({})
      .sort({ createdAt: -1 })
      .lean()

    res.json(photos)
  } catch (error) {
    console.error("Get photos error:", error)
    res.status(500).json({ error: "Failed to fetch photos", details: error.message })
  }
}

// GET /photos/:id - Get single photo with events
export const getPhotoById = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id).lean()

    if (!photo) {
      return res.status(404).json({ error: "Photo not found" })
    }

    res.json(photo)
  } catch (error) {
    console.error("Get photo error:", error)
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid photo ID" })
    }
    res.status(500).json({ error: "Failed to fetch photo", details: error.message })
  }
}

// PUT /photos/:id - Update status or append event in events array
export const updatePhoto = async (req, res) => {
  try {
    const { status, event } = req.body
    const photo = await Photo.findById(req.params.id)

    if (!photo) {
      return res.status(404).json({ error: "Photo not found" })
    }

    // Update status if provided
    if (status) {
      if (!["uploaded", "processing", "done"].includes(status)) {
        return res.status(400).json({ error: "Invalid status. Must be 'uploaded', 'processing', or 'done'" })
      }
      photo.status = status
    }

    // Append event if provided
    if (event) {
      if (!event.message || typeof event.message !== "string") {
        return res.status(400).json({ error: "Event message is required and must be a string" })
      }
      photo.events.push({
        timestamp: event.timestamp || new Date(),
        message: event.message,
      })
    }

    await photo.save()

    res.json(photo)
  } catch (error) {
    console.error("Update photo error:", error)
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid photo ID" })
    }
    res.status(500).json({ error: "Failed to update photo", details: error.message })
  }
}

// DELETE /photos/:id - Delete photo (optional helper)
export const deletePhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id)

    if (!photo) {
      return res.status(404).json({ error: "Photo not found" })
    }

    // Delete file from filesystem
    const filePath = path.join(__dirname, "../../uploads", photo.filename)
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }

    await Photo.findByIdAndDelete(req.params.id)

    res.json({ message: "Photo deleted successfully" })
  } catch (error) {
    console.error("Delete photo error:", error)
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid photo ID" })
    }
    res.status(500).json({ error: "Failed to delete photo", details: error.message })
  }
}

// POST /photos/retry/:id - Retry processing a photo
export const retryPhoto = async (req, res) => {
  try {
    const photo = await Photo.findById(req.params.id)

    if (!photo) {
      return res.status(404).json({ error: "Photo not found" })
    }

    // Reset status and add retry event
    photo.status = "uploaded"
    photo.events.push({
      timestamp: new Date(),
      message: "Retry requested by user",
    })

    await photo.save()

    // Add job to queue for processing
    try {
      await addJob(photo._id)
    } catch (error) {
      console.error(`Failed to add job for photo ${photo._id}:`, error)
      // Continue even if queue fails - photo is still saved
    }

    res.json(photo)
  } catch (error) {
    console.error("Retry photo error:", error)
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid photo ID" })
    }
    res.status(500).json({ error: "Failed to retry photo", details: error.message })
  }
}

// POST /photos/delete-many - Delete multiple photos
export const deleteManyPhotos = async (req, res) => {
  try {
    const { ids } = req.body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Invalid photo IDs" })
    }

    const photos = await Photo.find({ _id: { $in: ids } })

    // Delete files from filesystem
    photos.forEach((photo) => {
      const filePath = path.join(__dirname, "../../uploads", photo.filename)
      if (fs.existsSync(filePath)) {
        try {
          fs.unlinkSync(filePath)
        } catch (error) {
          console.error(`Failed to delete file ${photo.filename}:`, error)
        }
      }
    })

    // Delete from database
    const result = await Photo.deleteMany({ _id: { $in: ids } })

    res.json({ 
      message: `Deleted ${result.deletedCount} photo(s) successfully`,
      deletedCount: result.deletedCount 
    })
  } catch (error) {
    console.error("Delete many photos error:", error)
    res.status(500).json({ error: "Failed to delete photos", details: error.message })
  }
}
