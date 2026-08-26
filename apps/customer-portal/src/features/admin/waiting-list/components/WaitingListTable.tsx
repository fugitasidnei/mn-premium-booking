import "./WaitingListTable.css"

import type {
  AdminWaitingListEntry,
} from "../types/waitingList"

interface WaitingListTableProps {
  entries: AdminWaitingListEntry[]
}

function formatDate(value: string): string {
  if (!value) {
    return "—"
  }

  const date = new Date(
    `${value}T00:00:00`,
  )

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
    },
  ).format(date)
}

function formatCreatedAt(value: string): string {
  if (!value) {
    return "—"
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    },
  ).format(new Date(value))
}

function formatStatus(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    )
}

function WaitingListTable({
  entries,
}: WaitingListTableProps) {
  if (entries.length === 0) {
    return (
      <div className="waiting-list-empty">
        <h2>No waiting list requests</h2>

        <p>
          New Priority Access requests will appear here.
        </p>
      </div>
    )
  }

  return (
    <div className="waiting-list-table-wrapper">
      <table className="waiting-list-table">
        <thead>
          <tr>
            <th>Customer</th>
            <th>Contact</th>
            <th>Service</th>
            <th>Preferred schedule</th>
            <th>Status</th>
            <th>Requested</th>
          </tr>
        </thead>

        <tbody>
          {entries.map((entry) => (
            <tr key={entry.id}>
              <td>
                <strong>{entry.full_name}</strong>

                <span>{entry.vehicle}</span>
              </td>

              <td>
                <strong>{entry.phone}</strong>

                <span>{entry.email}</span>
              </td>

              <td>
                <strong>{entry.service}</strong>

                <span>{entry.plate_type}</span>
              </td>

              <td>
                <strong>
                  {formatDate(
                    entry.preferred_date,
                  )}
                </strong>

                <span>
                  {entry.preferred_time}
                </span>
              </td>

              <td>
                <span
                  className={`waiting-list-status waiting-list-status--${entry.status}`}
                >
                  {formatStatus(entry.status)}
                </span>
              </td>

              <td>
                {formatCreatedAt(
                  entry.created_at,
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default WaitingListTable
