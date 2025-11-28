import { memo } from "react"
import Card from "./Card"
import EventLogItem from "./EventLogItem"

const EventLog = memo(({ events = [], className }) => {
  return (
    <Card className={className}>
      <Card.Header className="border-b border-gray-200">
        <Card.Title className="text-lg">Event Log</Card.Title>
        <p className="text-sm text-gray-500 mt-1">
          Real-time activity
        </p>
      </Card.Header>
      <Card.Content className="p-0">
        {events.length > 0 ? (
          <div className="max-h-[600px] overflow-y-auto">
            {events.map((event) => (
              <EventLogItem key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <svg
              className="w-12 h-12 text-gray-400 mx-auto mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <p className="text-sm text-gray-500">No events yet</p>
          </div>
        )}
      </Card.Content>
    </Card>
  )
}, (prevProps, nextProps) => {
  // Only rerender if events array reference changes or length changes
  return (
    prevProps.events === nextProps.events ||
    (prevProps.events.length === nextProps.events.length &&
     prevProps.className === nextProps.className)
  )
})

EventLog.displayName = "EventLog"

export default EventLog
