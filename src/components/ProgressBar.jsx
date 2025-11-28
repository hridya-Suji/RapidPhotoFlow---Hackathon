import Progress from "./Progress"

const ProgressBar = ({ progress = 0, label, showPercentage = true }) => {
  return (
    <div className="w-full space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          {showPercentage && (
            <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
          )}
        </div>
      )}
      <Progress value={progress} />
    </div>
  )
}

export default ProgressBar

