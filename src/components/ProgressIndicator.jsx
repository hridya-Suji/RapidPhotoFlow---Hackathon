import Progress from "./Progress"
import { cn } from "../utils/utils"

const ProgressIndicator = ({ progress = 0, status, className }) => {
  const getProgressColor = () => {
    if (status === "processing") return "bg-blue-600"
    if (status === "uploaded") return "bg-gray-400"
    return "bg-gray-300"
  }

  return (
    <div className={cn("w-full space-y-2", className)}>
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-gray-600">
          {status === "processing" ? "Processing" : "Uploaded"}
        </span>
        <span className="text-xs text-gray-500">{Math.round(progress)}%</span>
      </div>
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={cn("h-full transition-all duration-300", getProgressColor())}
          style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
        />
      </div>
    </div>
  )
}

export default ProgressIndicator

