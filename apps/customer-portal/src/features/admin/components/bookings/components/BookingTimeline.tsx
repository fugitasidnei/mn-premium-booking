type TimelineEvent = {
  id: string
  event_type: string
  title: string
  description: string | null
  old_value: string | null
  new_value: string | null
  created_by: string | null
  created_at: string | null
}

type BookingTimelineProps = {
  timeline: TimelineEvent[]
  isLoading: boolean
  error: string | null
}

function formatDateTime(
  value: string | null,
): string {
  if (!value) {
    return "—"
  }

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(date)
}

function getTimelineItemClass(
  eventType: string,
): string {
  if (eventType.includes("cancel")) {
    return "booking-timeline-item booking-timeline-item--cancelled"
  }

  if (
    eventType.includes("confirm") ||
    eventType.includes("complete") ||
    eventType.includes("created")
  ) {
    return "booking-timeline-item booking-timeline-item--completed"
  }

  return "booking-timeline-item booking-timeline-item--pending"
}

function BookingTimeline({
  timeline,
  isLoading,
  error,
}: BookingTimelineProps) {
  return (
    <section className="booking-details-section">
      <div className="booking-details-section__header">
        <h3>Booking Timeline</h3>

        {!isLoading && !error && (
          <span>
            {timeline.length}{" "}
            {timeline.length === 1
              ? "event"
              : "events"}
          </span>
        )}
      </div>

      {isLoading && (
        <p className="booking-details-empty">
          Loading timeline...
        </p>
      )}

      {error && (
        <p className="booking-details-empty">
          {error}
        </p>
      )}

      {!isLoading &&
        !error &&
        timeline.length === 0 && (
          <p className="booking-details-empty">
            No timeline events were
            registered for this booking yet.
          </p>
        )}

      {!isLoading &&
        !error &&
        timeline.length > 0 && (
          <div className="booking-details-timeline">
            {timeline.map(
              (timelineEvent) => (
                <article
                  className={getTimelineItemClass(
                    timelineEvent.event_type,
                  )}
                  key={timelineEvent.id}
                >
                  <div className="booking-timeline-item__marker" />

                  <div>
                    <strong>
                      {timelineEvent.title}
                    </strong>

                    <span>
                      {formatDateTime(
                        timelineEvent.created_at,
                      )}
                    </span>

                    {timelineEvent.description && (
                      <span>
                        {
                          timelineEvent.description
                        }
                      </span>
                    )}

                    {(timelineEvent.old_value ||
                      timelineEvent.new_value) && (
                      <span>
                        {timelineEvent.old_value ??
                          "—"}
                        {" → "}
                        {timelineEvent.new_value ??
                          "—"}
                      </span>
                    )}

                    <span>
                      By:{" "}
                      {timelineEvent.created_by ||
                        "System"}
                    </span>
                  </div>
                </article>
              ),
            )}
          </div>
        )}
    </section>
  )
}

export default BookingTimeline