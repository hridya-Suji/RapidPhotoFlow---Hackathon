import { cn } from "../utils/utils"

const Button = ({ className, variant = "default", size = "default", children, ...props }) => {
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 shadow-sm hover:shadow-md",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 active:bg-gray-100 text-gray-700 hover:text-gray-900",
    ghost: "hover:bg-gray-100 active:bg-gray-200 text-gray-700",
    destructive: "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 shadow-sm hover:shadow-md",
  }

  const sizes = {
    default: "h-10 px-4 py-2 text-sm",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-6 sm:px-8 text-base",
    icon: "h-10 w-10",
  }

  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button

