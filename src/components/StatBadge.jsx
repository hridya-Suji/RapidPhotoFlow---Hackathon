import { memo } from "react"
import { cn } from "../utils/utils"

const StatBadge = memo(({ color, label, value, className }) => {
  const colorClasses = {
    blue: "bg-blue-600",
    green: "bg-green-600",
    gray: "bg-gray-400",
    yellow: "bg-yellow-600",
    red: "bg-red-600",
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "w-3 h-3 rounded-full transition-all duration-200",
          colorClasses[color] || colorClasses.gray
        )}
      />
      <span className="text-sm text-gray-600">
        {label}: <span className="font-semibold text-gray-900">{value}</span>
      </span>
    </div>
  )
}, (prevProps, nextProps) => {
  return (
    prevProps.color === nextProps.color &&
    prevProps.label === nextProps.label &&
    prevProps.value === nextProps.value &&
    prevProps.className === nextProps.className
  )
})

StatBadge.displayName = "StatBadge"

export default StatBadge

