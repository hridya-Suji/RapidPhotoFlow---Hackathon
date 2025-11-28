import { Link, useLocation } from "react-router-dom"
import { cn } from "../utils/helpers"

const TopNav = () => {
  const location = useLocation()

  const navItems = [
    { path: "/upload", label: "Upload" },
    { path: "/processing", label: "Processing" },
    { path: "/gallery", label: "Gallery" },
  ]

  return (
    <nav className="w-full border-b border-gray-200 bg-white shadow-sm sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          <div className="flex items-center">
            <Link to="/" className="text-[28px] font-semibold title-gradient">
              RapidPhotoFlow
            </Link>
          </div>
          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || 
                (location.pathname === "/" && item.path === "/upload")
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "px-3 sm:px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                    isActive
                      ? "bg-blue-50 text-blue-700 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50 active:bg-gray-100"
                  )}
                >
                  {item.label}
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default TopNav

