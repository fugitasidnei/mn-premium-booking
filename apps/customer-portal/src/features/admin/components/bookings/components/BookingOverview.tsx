import type {
  AdminBooking,
  BookingService,
} from "../../../../../types/adminBooking"

type CustomerStatistics = {
  totalBookings: number
  confirmedCount: number
  cancelledCount: number
  totalSpent: number
  averageTicket: number
  firstBookingDate: string | null
}

type BookingOverviewProps = {
  booking: AdminBooking
  customerName: string
  statistics: CustomerStatistics
}

function formatDate(
  value: string | null,
): string {
  if (!value) {
    return "—"
  }

  const dateValue =
    value.includes("T")
      ? value.slice(0, 10)
      : value

  const [year, month, day] =
    dateValue.split("-")

  if (!year || !month || !day) {
    return value
  }

  return `${month}/${day}/${year}`
}

function formatTime(
  value: string,
): string {
  return value.slice(0, 5)
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

function getServiceLabel(
  service: BookingService,
): string {
  if (service === "premium") {
    return "Premium Finish"
  }

  return "Exterior Wash"
}

function BookingOverview({
  booking,
  customerName,
  statistics,
}: BookingOverviewProps) {
  return (
    <>
      <section className="booking-details-section">
        <div className="booking-details-section__header">
          <h3>Appointment</h3>
        </div>

        <div className="booking-details-grid">
          <div className="booking-details-field">
            <span>Date</span>

            <strong>
              {formatDate(
                booking.booking_date,
              )}
            </strong>
          </div>

          <div className="booking-details-field">
            <span>Time</span>

            <strong>
              {formatTime(
                booking.booking_time,
              )}
            </strong>
          </div>

          <div className="booking-details-field">
            <span>Service</span>

            <strong>
              {getServiceLabel(
                booking.service,
              )}
            </strong>
          </div>

          <div className="booking-details-field">
            <span>Plate type</span>

            <strong>
              {booking.plate_type ===
              "yellow"
                ? "Yellow plate"
                : "White plate"}
            </strong>
          </div>

          <div className="booking-details-field booking-details-field--wide">
            <span>Price</span>

            <strong>
              {formatCurrency(
                Number(booking.price) || 0,
              )}
            </strong>
          </div>
        </div>
      </section>

      <section className="booking-details-section">
        <div className="booking-details-section__header">
          <h3>Customer</h3>
        </div>

        <div className="booking-details-grid">
          <div className="booking-details-field booking-details-field--wide">
            <span>Full name</span>

            <strong>
              {customerName}
            </strong>
          </div>

          <div className="booking-details-field booking-details-field--wide">
            <span>Phone</span>

            {booking.phone ? (
              <a href={`tel:${booking.phone}`}>
                {booking.phone}
              </a>
            ) : (
              <strong>
                Not informed
              </strong>
            )}
          </div>

          <div className="booking-details-field booking-details-field--wide">
            <span>Email</span>

            {booking.email ? (
              <a href={`mailto:${booking.email}`}>
                {booking.email}
              </a>
            ) : (
              <strong>
                Not informed
              </strong>
            )}
          </div>
        </div>
      </section>

      <section className="booking-details-section">
        <div className="booking-details-section__header">
          <h3>Vehicle</h3>
        </div>

        <div className="booking-details-grid">
          <div className="booking-details-field">
            <span>Vehicle</span>

            <strong>
              {booking.vehicle ||
                "Not informed"}
            </strong>
          </div>

          <div className="booking-details-field">
            <span>Model</span>

            <strong>
              {booking.model ||
                "Not informed"}
            </strong>
          </div>

          <div className="booking-details-field booking-details-field--wide">
            <span>License plate</span>

            <strong>
              {booking.license_plate ||
                "Not informed"}
            </strong>
          </div>
        </div>
      </section>

      <section className="booking-details-section">
        <div className="booking-details-section__header">
          <h3>Customer Statistics</h3>
        </div>

        <div className="booking-details-statistics">
          <div>
            <span>Total bookings</span>

            <strong>
              {statistics.totalBookings}
            </strong>
          </div>

          <div>
            <span>Confirmed</span>

            <strong>
              {statistics.confirmedCount}
            </strong>
          </div>

          <div>
            <span>Cancelled</span>

            <strong>
              {statistics.cancelledCount}
            </strong>
          </div>

          <div>
            <span>Total spent</span>

            <strong>
              {formatCurrency(
                statistics.totalSpent,
              )}
            </strong>
          </div>

          <div>
            <span>Average ticket</span>

            <strong>
              {formatCurrency(
                statistics.averageTicket,
              )}
            </strong>
          </div>

          <div>
            <span>Customer since</span>

            <strong>
              {formatDate(
                statistics.firstBookingDate,
              )}
            </strong>
          </div>
        </div>
      </section>
    </>
  )
}

export default BookingOverview