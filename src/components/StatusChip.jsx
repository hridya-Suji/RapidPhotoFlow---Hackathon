import Badge from "./Badge"

const StatusChip = ({ status }) => {
  const statusConfig = {
    uploaded: { label: "Uploaded", variant: "success" },
    processing: { label: "Processing", variant: "orange" },
    done: { label: "Done", variant: "success" },
    pending: { label: "Pending", variant: "default" },
    completed: { label: "Completed", variant: "success" },
    incomplete: { label: "Incomplete", variant: "error" },
    error: { label: "Error", variant: "error" },
    queued: { label: "Queued", variant: "warning" },
  }

  const config = statusConfig[status] || statusConfig.pending

  return (
    <Badge variant={config.variant} className="text-xs font-medium px-2.5 py-0.5">
      {config.label}
    </Badge>
  )
}

export default StatusChip

