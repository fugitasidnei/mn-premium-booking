import {
  AdminBadge,
} from "../../layout/ui"

import type {
  AdminBooking,
  BookingService,
  BookingStatus,
} from "../../../../../types/adminBooking"

type BookingHistoryProps = {
  bookings: AdminBooking[]
  totalBookings: number
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

function getVehicleDescription(
  booking: AdminBooking,
): string {
  return [
    booking.vehicle,
    booking.model,
  ]
    .filter(Boolean)
    .join(" ")
    .trim()
}

function getServiceLabel(
  service: BookingService,
): string {
  if (service === "premium") {
    return "Premium Finish"
  }

  return "Exterior Wash"
}

function getStatusLabel(
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
  | "pending"
  | "confirmed"
  | "cancelled" {
  return status
}

function BookingHistory({
  bookings,
  totalBookings,
}: BookingHistoryProps) {
  return (
    <section className="booking-details-section">
      <div className="booking-details-section__header">
        <h3>Booking History</h3>

        <span>
          {totalBookings} records
        </span>
      </div>

      <div className="booking-details-history">
        {bookings.map(
          (historyBooking) => (
            <article
              className={`booking-history-item booking-history-item--${historyBooking.status}`}
              key={historyBooking.id}
            >
              <div className="booking-history-item__marker" />

              <div className="booking-history-item__content">
                <div className="booking-history-item__header">
                  <div>
                    <strong>
                      {getServiceLabel(
                        historyBooking.service,
                      )}
                    </strong>

                    <span>
                      {formatDate(
                        historyBooking.booking_date,
                      )}
                      {" at "}
                      {formatTime(
                        historyBooking.booking_time,
                      )}
                    </span>
                  </div>

                  <AdminBadge
                    variant={getStatusVariant(
                      historyBooking.status,
                    )}
                  >
                    {getStatusLabel(
                      historyBooking.status,
                    )}
                  </AdminBadge>
                </div>

                <div className="booking-history-item__details">
                  <span>
                    {getVehicleDescription(
                      historyBooking,
                    ) ||
                      "Vehicle not informed"}
                  </span>

                  <span>
                    Plate:{" "}
                    {historyBooking.license_plate ||
                      "Not informed"}
                  </span>

                  <strong>
                    {historyBooking.status ===
                    "cancelled"
                      ? formatCurrency(0)
                      : formatCurrency(
                          Number(
                            historyBooking.price,
                          ) || 0,
                        )}
                  </strong>
                </div>
              </div>
            </article>
          ),
        )}
      </div>
    </section>
  )
}

export default BookingHistory