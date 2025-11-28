import TopNav from "./TopNav"
import { cn } from "../utils/helpers"

const PageLayout = ({ children, className }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopNav />
      <div className={cn("max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8", className)}>
        {children}
      </div>
    </div>
  )
}

export default PageLayout

