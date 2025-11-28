import multer from "multer"
import path from "path"
import { fileURLToPath } from "url"
import fs from "fs"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Ensure uploads directory exists (synchronous but only runs once at startup)
const uploadsDir = path.join(__dirname, "../../uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Note: fs.existsSync and fs.mkdirSync are synchronous but:
// - Only run once at module load (server startup)
// - Not in request handler path
// - Acceptable for one-time initialization

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname))
  },
})

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp/
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = allowedTypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb(new Error("Only image files (jpeg, jpg, png, webp) are allowed"), false)
  }
}

// Configure multer with diskStorage (writes immediately to disk, not buffered in memory)
// This ensures files are written as they arrive, preventing memory issues
// No file count limit - supports large batches (100+ photos)
const upload = multer({
  storage: storage, // diskStorage writes directly to disk
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
    // No files limit - allows unlimited files per request
    fieldSize: 10 * 1024 * 1024, // 10MB field size
    fieldNameSize: 100, // Max field name size
    fields: 10, // Max number of non-file fields
  },
  fileFilter: fileFilter,
})

export default upload

