import {
  useMemo,
} from "react"

import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminTable,
} from "./components/layout/ui"

import {
  useAdminBookings,
} from "../../hooks/useAdminBookings"

import type {
  AdminBooking,
  BookingService,
  BookingStatus,
} from "../../types/adminBooking"

import "./DashboardPage.css"

function getLocalDateString(
  date = new Date(),
): string {
  const year = date.getFullYear()

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0")

  const day = String(
    date.getDate(),
  ).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function formatDate(
  date: string,
): string {
  const [year, month, day] =
    date.split("-")

  if (!year || !month || !day) {
    return date
  }

  return `${month}/${day}/${year}`
}

function formatTime(
  time: string,
): string {
  return time.slice(0, 5)
}

function formatCurrency(
  value: number,
): string {
  return new Intl.NumberFormat(
    "en-US",
    {
      style: "currency",
      currency: "USD",
    },
  ).format(value)
}

function getCustomerName(
  booking: AdminBooking,
): string {
  return [
    booking.first_name,
    booking.last_name,
  ]
    .join(" ")
    .trim()
}

function getServiceName(
  service: BookingService,
): string {
  if (service === "premium") {
    return "Premium Finish"
  }

  return "Exterior Wash"
}

function getStatusName(
  status: BookingStatus,
): string {
  if (status === "confirmed") {
    return "Confirmed"
  }

  if (status === "cancelled") {
    return "Cancelled"
  }

  return "Pending"
}

function getStatusVariant(
  status: BookingStatus,
):
  | "success"
  | "danger"
  | "warning" {
  if (status === "confirmed") {
    return "success"
  }

  if (status === "cancelled") {
    return "danger"
  }

  return "warning"
}

function DashboardPage() {
  const {
    bookings,
    isLoading,
    error,
    refreshBookings,
  } = useAdminBookings()

  const dashboardData = useMemo(() => {
    const today =
      getLocalDateString()

    const activeBookings =
      bookings.filter(
        (booking) =>
          booking.status !== "cancelled",
      )

    const todayBookings =
      activeBookings
        .filter(
          (booking) =>
            booking.booking_date === today,
        )
        .sort((firstBooking, secondBooking) =>
          firstBooking.booking_time.localeCompare(
            secondBooking.booking_time,
          ),
        )

    const upcomingBookings =
      activeBookings
        .filter(
          (booking) =>
            booking.booking_date >= today,
        )
        .sort((firstBooking, secondBooking) => {
          const firstDateTime =
            `${firstBooking.booking_date} ${firstBooking.booking_time}`

          const secondDateTime =
            `${secondBooking.booking_date} ${secondBooking.booking_time}`

          return firstDateTime.localeCompare(
            secondDateTime,
          )
        })

    const pendingBookings =
      bookings.filter(
        (booking) =>
          booking.status === "pending",
      )

    const confirmedBookings =
      bookings.filter(
        (booking) =>
          booking.status === "confirmed",
      )

    const cancelledBookings =
      bookings.filter(
        (booking) =>
          booking.status === "cancelled",
      )

    const todayRevenue =
      todayBookings.reduce(
        (total, booking) =>
          total +
          (Number(booking.price) || 0),
        0,
      )

    const scheduledRevenue =
      upcomingBookings.reduce(
        (total, booking) =>
          total +
          (Number(booking.price) || 0),
        0,
      )

    const exteriorBookings =
      activeBookings.filter(
        (booking) =>
          booking.service === "exterior",
      ).length

    const premiumBookings =
      activeBookings.filter(
        (booking) =>
          booking.service === "premium",
      ).length

    return {
      todayBookings,
      upcomingBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      todayRevenue,
      scheduledRevenue,
      exteriorBookings,
      premiumBookings,
    }
  }, [bookings])

  const nextBookings =
    dashboardData.upcomingBookings.slice(
      0,
      6,
    )

  return (
    <section className="dashboard-page">
      <header className="dashboard-page__header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Real-time overview of MN Premium
            Service operations.
          </p>
        </div>

        <AdminButton
          variant="primary"
          disabled={isLoading}
          onClick={() => {
            void refreshBookings()
          }}
        >
          {isLoading
            ? "Refreshing..."
            : "Refresh"}
        </AdminButton>
      </header>

      {error && (
        <div className="dashboard-page__error">
          {error}
        </div>
      )}

      <div className="dashboard-summary">
        <AdminCard className="dashboard-summary-card">
          <span>Today&apos;s Bookings</span>

          <strong>
            {
              dashboardData
                .todayBookings.length
            }
          </strong>

          <small>
            Appointments scheduled today
          </small>
        </AdminCard>

        <AdminCard className="dashboard-summary-card">
          <span>Pending Confirmation</span>

          <strong>
            {
              dashboardData
                .pendingBookings.length
            }
          </strong>

          <small>
            Customers awaiting confirmation
          </small>
        </AdminCard>

        <AdminCard className="dashboard-summary-card">
          <span>Today&apos;s Revenue</span>

          <strong>
            {formatCurrency(
              dashboardData.todayRevenue,
            )}
          </strong>

          <small>
            Active appointments today
          </small>
        </AdminCard>

        <AdminCard className="dashboard-summary-card">
          <span>Scheduled Revenue</span>

          <strong>
            {formatCurrency(
              dashboardData
                .scheduledRevenue,
            )}
          </strong>

          <small>
            Current and future bookings
          </small>
        </AdminCard>
      </div>

      <div className="dashboard-secondary-summary">
        <AdminCard className="dashboard-status-card">
          <div>
            <span>Confirmed</span>

            <strong>
              {
                dashboardData
                  .confirmedBookings.length
              }
            </strong>
          </div>

          <AdminBadge variant="success">
            Active
          </AdminBadge>
        </AdminCard>

        <AdminCard className="dashboard-status-card">
          <div>
            <span>Pending</span>

            <strong>
              {
                dashboardData
                  .pendingBookings.length
              }
            </strong>
          </div>

          <AdminBadge variant="warning">
            Attention
          </AdminBadge>
        </AdminCard>

        <AdminCard className="dashboard-status-card">
          <div>
            <span>Cancelled</span>

            <strong>
              {
                dashboardData
                  .cancelledBookings.length
              }
            </strong>
          </div>

          <AdminBadge variant="danger">
            Cancelled
          </AdminBadge>
        </AdminCard>

        <AdminCard className="dashboard-status-card">
          <div>
            <span>Service Mix</span>

            <strong>
              {
                dashboardData
                  .premiumBookings
              }
              {" / "}
              {
                dashboardData
                  .exteriorBookings
              }
            </strong>
          </div>

          <small>
            Premium / Exterior
          </small>
        </AdminCard>
      </div>

      <div className="dashboard-content-grid">
        <AdminCard className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <h2>Today&apos;s Schedule</h2>

              <p>
                All active appointments for
                today.
              </p>
            </div>

            <AdminBadge variant="confirmed">
              {
                dashboardData
                  .todayBookings.length
              }
              {" appointments"}
            </AdminBadge>
          </div>

          {dashboardData
            .todayBookings.length === 0 ? (
            <div className="dashboard-empty">
              No appointments scheduled for
              today.
            </div>
          ) : (
            <div className="dashboard-timeline">
              {dashboardData
                .todayBookings.map(
                  (booking) => (
                    <article
                      className="dashboard-timeline-item"
                      key={booking.id}
                    >
                      <div className="dashboard-timeline-item__time">
                        {formatTime(
                          booking.booking_time,
                        )}
                      </div>

                      <div className="dashboard-timeline-item__content">
                        <strong>
                          {getCustomerName(
                            booking,
                          )}
                        </strong>

                        <span>
                          {getServiceName(
                            booking.service,
                          )}
                        </span>

                        <small>
                          {[
                            booking.vehicle,
                            booking.model,
                            booking.license_plate,
                          ]
                            .filter(Boolean)
                            .join(" · ")}
                        </small>
                      </div>

                      <AdminBadge
                        variant={getStatusVariant(
                          booking.status,
                        )}
                      >
                        {getStatusName(
                          booking.status,
                        )}
                      </AdminBadge>
                    </article>
                  ),
                )}
            </div>
          )}
        </AdminCard>

        <AdminCard className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <h2>Operations</h2>

              <p>
                Current booking distribution.
              </p>
            </div>
          </div>

          <div className="dashboard-operation-list">
            <div className="dashboard-operation-item">
              <span>Exterior Wash</span>

              <strong>
                {
                  dashboardData
                    .exteriorBookings
                }
              </strong>
            </div>

            <div className="dashboard-operation-item">
              <span>Premium Finish</span>

              <strong>
                {
                  dashboardData
                    .premiumBookings
                }
              </strong>
            </div>

            <div className="dashboard-operation-item">
              <span>Upcoming Bookings</span>

              <strong>
                {
                  dashboardData
                    .upcomingBookings.length
                }
              </strong>
            </div>

            <div className="dashboard-operation-item">
              <span>Pending Actions</span>

              <strong>
                {
                  dashboardData
                    .pendingBookings.length
                }
              </strong>
            </div>
          </div>
        </AdminCard>
      </div>

      <AdminCard className="dashboard-panel">
        <div className="dashboard-panel__header">
          <div>
            <h2>Next Appointments</h2>

            <p>
              The next six active customer
              appointments.
            </p>
          </div>
        </div>

        {nextBookings.length === 0 ? (
          <div className="dashboard-empty">
            No upcoming appointments found.
          </div>
        ) : (
          <AdminTable>
            <thead>
              <tr>
                <th>Date</th>
                <th>Time</th>
                <th>Customer</th>
                <th>Service</th>
                <th>Vehicle</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {nextBookings.map(
                (booking) => (
                  <tr key={booking.id}>
                    <td>
                      {formatDate(
                        booking.booking_date,
                      )}
                    </td>

                    <td>
                      {formatTime(
                        booking.booking_time,
                      )}
                    </td>

                    <td>
                      <strong>
                        {getCustomerName(
                          booking,
                        )}
                      </strong>

                      <small className="dashboard-table-detail">
                        {booking.phone}
                      </small>
                    </td>

                    <td>
                      {getServiceName(
                        booking.service,
                      )}
                    </td>

                    <td>
                      {[
                        booking.vehicle,
                        booking.model,
                      ]
                        .filter(Boolean)
                        .join(" ") || "—"}

                      <small className="dashboard-table-detail">
                        {booking.license_plate ||
                          "No plate"}
                      </small>
                    </td>

                    <td>
                      {formatCurrency(
                        Number(
                          booking.price,
                        ) || 0,
                      )}
                    </td>

                    <td>
                      <AdminBadge
                        variant={getStatusVariant(
                          booking.status,
                        )}
                      >
                        {getStatusName(
                          booking.status,
                        )}
                      </AdminBadge>
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </AdminTable>
        )}
      </AdminCard>
    </section>
  )
}

export default DashboardPage