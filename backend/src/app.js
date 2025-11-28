import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";
import { fileURLToPath } from "url";
import photosRoutes from "./routes/photos.js";

dotenv.config();

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---------------- CORS ----------------
app.use(
  cors({
    origin: "http://localhost:5173",  // Vite frontend
    credentials: true,
  })
);

// ---------------- Middleware ----------------
// Increase body size limits for large file uploads
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));

// ---------------- Serve Uploaded Files ----------------
// Upload folder is backend/uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ---------------- API Routes ----------------
app.use("/api/photos", photosRoutes);

// ---------------- Health Check ----------------
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "RapidPhotoFlow API is running" });
});

// ---------------- 404 Handler ----------------
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ---------------- Error Handler ----------------
app.use((err, req, res, next) => {
  console.error("Error:", err);

  // Multer errors
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "File too large. Max size is 10MB" });
    }
    // LIMIT_FILE_COUNT removed - no file count limit
    if (err.code === "LIMIT_UNEXPECTED_FILE") {
      return res.status(400).json({ error: "Unexpected file field. Use 'photos' field name" });
    }
    return res.status(400).json({ error: err.message });
  }

  // Mongoose validation errors
  if (err.name === "ValidationError") {
    return res.status(400).json({ error: err.message });
  }

  // Default
  res.status(err.status || 500).json({
    error: err.message || "Something went wrong!",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;
