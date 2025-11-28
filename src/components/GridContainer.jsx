import { cn } from "../utils/utils"

const GridContainer = ({ children, className, cols = "auto" }) => {
  const gridCols = {
    auto: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
    5: "grid-cols-2 md:grid-cols-3 lg:grid-cols-5",
    6: "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
  }

  return (
    <div
      className={cn(
        "grid gap-4 sm:gap-6",
        typeof cols === "string" ? gridCols[cols] || gridCols.auto : gridCols.auto,
        className
      )}
    >
      {children}
    </div>
  )
}

export default GridContainer

