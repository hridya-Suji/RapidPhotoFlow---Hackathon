import mongoose from "mongoose"

const eventSchema = new mongoose.Schema(
  {
    timestamp: {
      type: Date,
      required: true,
      default: Date.now,
    },
    message: {
      type: String,
      required: true,
    },
  },
  { _id: false }
)

const photoSchema = new mongoose.Schema(
  {
    filename: {
      type: String,
      required: true,
    },
    filepath: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["uploaded", "processing", "done"],
      default: "uploaded",
    },
    events: {
      type: [eventSchema],
      default: [],
    },
  },
  {
    timestamps: true, // Creates createdAt and updatedAt automatically
  }
)

const Photo = mongoose.model("Photo", photoSchema)

export default Photo
