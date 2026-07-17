import { useMemo } from "react"

import DashboardGrid from "../dashboard/DashboardGrid"
import StatCard from "../dashboard/StatCard"

import {
  AdminBadge,
  AdminButton,
  AdminCard,
} from "../components/layout/ui"

import { useAdminBookings } from "../../../hooks/useAdminBookings"

import "./DashboardHome.css"

function getLocalDateString(date: Date): string {
  const year = date.getFullYear()

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0")

  const day = String(
    date.getDate(),
  ).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function formatDate(date: string): string {
  const [year, month, day] = date.split("-")

  if (!year || !month || !day) {
    return date
  }

  return `${month}/${day}/${year}`
}

function formatTime(time: string): string {
  return time.slice(0, 5)
}

function formatService(service: string): string {
  if (service === "exterior") {
    return "Exterior Wash"
  }

  if (service === "premium") {
    return "Premium Finish"
  }

  return service
}

function DashboardHome() {
  const {
    bookings,
    isLoading,
    error,
    refreshBookings,
  } = useAdminBookings()

  const dashboardData = useMemo(() => {
    const now = new Date()
    const todayString = getLocalDateString(now)

    const startOfWeek = new Date(now)

    const currentDay = startOfWeek.getDay()

    const daysFromMonday =
      currentDay === 0
        ? 6
        : currentDay - 1

    startOfWeek.setDate(
      startOfWeek.getDate() -
        daysFromMonday,
    )

    const endOfWeek = new Date(startOfWeek)

    endOfWeek.setDate(
      endOfWeek.getDate() + 6,
    )

    const startOfWeekString =
      getLocalDateString(startOfWeek)

    const endOfWeekString =
      getLocalDateString(endOfWeek)

    const activeBookings = bookings.filter(
      (booking) =>
        booking.status !== "cancelled",
    )

    const todayBookings = activeBookings.filter(
      (booking) =>
        booking.booking_date ===
        todayString,
    )

    const weekBookings = activeBookings.filter(
      (booking) =>
        booking.booking_date >=
          startOfWeekString &&
        booking.booking_date <=
          endOfWeekString,
    )

    const totalRevenue = activeBookings.reduce(
      (total, booking) =>
        total + Number(booking.price),
      0,
    )

    const customerKeys = new Set(
      bookings.map((booking) => {
        const email = booking.email
          .trim()
          .toLowerCase()

        if (email) {
          return `email:${email}`
        }

        const phone = booking.phone.replace(
          /\D/g,
          "",
        )

        if (phone) {
          return `phone:${phone}`
        }

        return [
          booking.first_name,
          booking.last_name,
        ]
          .join(":")
          .trim()
          .toLowerCase()
      }),
    )

    const upcomingBookings = activeBookings
      .filter((booking) => {
        const bookingDateTime = new Date(
          `${booking.booking_date}T${booking.booking_time}`,
        )

        return (
          !Number.isNaN(
            bookingDateTime.getTime(),
          ) &&
          bookingDateTime >= now
        )
      })
      .sort(
        (
          firstBooking,
          secondBooking,
        ) => {
          const firstDateTime =
            `${firstBooking.booking_date}T${firstBooking.booking_time}`

          const secondDateTime =
            `${secondBooking.booking_date}T${secondBooking.booking_time}`

          return firstDateTime.localeCompare(
            secondDateTime,
          )
        },
      )
      .slice(0, 5)

    const serviceCounts = activeBookings.reduce<
      Record<string, number>
    >((services, booking) => {
      services[booking.service] =
        (services[booking.service] || 0) +
        1

      return services
    }, {})

    const popularServices = Object.entries(
      serviceCounts,
    ).sort(
      (
        firstService,
        secondService,
      ) =>
        secondService[1] -
        firstService[1],
    )

    return {
      todayBookingsCount:
        todayBookings.length,

      weekBookingsCount:
        weekBookings.length,

      customersCount:
        customerKeys.size,

      totalRevenue,
      upcomingBookings,
      popularServices,
    }
  }, [bookings])

  return (
    <section className="dashboard-home">
      <header className="dashboard-home__header">
        <div>
          <h1>Dashboard</h1>

          <p>
            Monitor bookings, customers and
            business performance.
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
        <div className="dashboard-home__error">
          {error}
        </div>
      )}

      <DashboardGrid>
        <StatCard
          title="Today's Bookings"
          value={String(
            dashboardData
              .todayBookingsCount,
          )}
          subtitle="Scheduled for today"
          tone="blue"
        />

        <StatCard
          title="Week Bookings"
          value={String(
            dashboardData
              .weekBookingsCount,
          )}
          subtitle="Monday through Sunday"
          tone="orange"
        />

        <StatCard
          title="Customers"
          value={String(
            dashboardData.customersCount,
          )}
          subtitle="Unique customers"
          tone="green"
        />

        <StatCard
          title="Total Revenue"
          value={`$${dashboardData.totalRevenue.toFixed(
            2,
          )}`}
          subtitle="Excluding cancellations"
          tone="purple"
        />
      </DashboardGrid>

      <div className="dashboard-home__panels">
        <AdminCard className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <h2>Upcoming Bookings</h2>

              <p>
                Next scheduled appointments.
              </p>
            </div>

            <span className="dashboard-panel__count">
              {
                dashboardData
                  .upcomingBookings.length
              }
            </span>
          </div>

          {isLoading ? (
            <div className="dashboard-panel__empty">
              Loading bookings...
            </div>
          ) : dashboardData
              .upcomingBookings.length ===
            0 ? (
            <div className="dashboard-panel__empty">
              No upcoming bookings.
            </div>
          ) : (
            <div className="dashboard-booking-list">
              {dashboardData
                .upcomingBookings.map(
                  (booking) => (
                    <article
                      className="dashboard-booking"
                      key={booking.id}
                    >
                      <div className="dashboard-booking__schedule">
                        <strong>
                          {formatDate(
                            booking.booking_date,
                          )}
                        </strong>

                        <span>
                          {formatTime(
                            booking.booking_time,
                          )}
                        </span>
                      </div>

                      <div className="dashboard-booking__customer">
                        <strong>
                          {booking.first_name}{" "}
                          {booking.last_name}
                        </strong>

                        <span>
                          {formatService(
                            booking.service,
                          )}
                        </span>
                      </div>

                      <div className="dashboard-booking__status">
                        <strong>
                          $
                          {Number(
                            booking.price,
                          ).toFixed(2)}
                        </strong>

                        <AdminBadge
                          variant={
                            booking.status ===
                            "confirmed"
                              ? "success"
                              : "warning"
                          }
                        >
                          {booking.status}
                        </AdminBadge>
                      </div>
                    </article>
                  ),
                )}
            </div>
          )}
        </AdminCard>

        <AdminCard className="dashboard-panel">
          <div className="dashboard-panel__header">
            <div>
              <h2>Popular Services</h2>

              <p>
                Most requested services.
              </p>
            </div>
          </div>

          {dashboardData
            .popularServices.length ===
          0 ? (
            <div className="dashboard-panel__empty">
              No service data available.
            </div>
          ) : (
            <div className="dashboard-service-list">
              {dashboardData
                .popularServices.map(
                  ([service, count]) => {
                    const highestCount =
                      dashboardData
                        .popularServices[0]?.[1] ||
                      1

                    const percentage =
                      Math.round(
                        (count /
                          highestCount) *
                          100,
                      )

                    return (
                      <article
                        className="dashboard-service"
                        key={service}
                      >
                        <div className="dashboard-service__info">
                          <strong>
                            {formatService(
                              service,
                            )}
                          </strong>

                          <span>
                            {count}{" "}
                            {count === 1
                              ? "booking"
                              : "bookings"}
                          </span>
                        </div>

                        <div className="dashboard-service__track">
                          <div
                            className="dashboard-service__progress"
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </article>
                    )
                  },
                )}
            </div>
          )}
        </AdminCard>
      </div>
    </section>
  )
}

export default DashboardHome