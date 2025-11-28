import { cn } from "../utils/utils"

const Card = ({ className, children, hover = false, ...props }) => {
  return (
    <div
      className={cn(
        "rounded-lg border border-gray-200 bg-white shadow-sm transition-all duration-200",
        hover && "hover:shadow-md hover:border-gray-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const CardHeader = ({ className, children, ...props }) => {
  return (
    <div className={cn("flex flex-col space-y-1.5 p-4 sm:p-6", className)} {...props}>
      {children}
    </div>
  )
}

const CardTitle = ({ className, children, ...props }) => {
  return (
    <h3 className={cn("text-lg sm:text-xl font-semibold leading-none tracking-tight text-gray-900", className)} {...props}>
      {children}
    </h3>
  )
}

const CardContent = ({ className, children, ...props }) => {
  return (
    <div className={cn("p-4 sm:p-6 pt-0", className)} {...props}>
      {children}
    </div>
  )
}

Card.Header = CardHeader
Card.Title = CardTitle
Card.Content = CardContent

export default Card

