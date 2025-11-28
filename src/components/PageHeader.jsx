import { cn } from "../utils/utils"

const PageHeader = ({
  title,
  description,
  actions,
  stats,
  className,
}) => {
  return (
    <div className={cn("mb-6 sm:mb-8", className)}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4 sm:mb-6">
        <div>
          <h1 className="text-[22px] font-medium title-gradient mb-2">
            {title}
          </h1>
          {description && (
            <p className="text-base sm:text-lg text-gray-600">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {actions}
          </div>
        )}
      </div>
      {stats && (
        <div className="flex flex-wrap items-center gap-4 sm:gap-6 mt-4 sm:mt-6">
          {stats}
        </div>
      )}
    </div>
  )
}

export default PageHeader

