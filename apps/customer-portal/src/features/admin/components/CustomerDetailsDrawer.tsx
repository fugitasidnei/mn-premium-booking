import {
  useEffect,
  useMemo,
} from "react"

import {
  AdminBadge,
  AdminButton,
} from "./layout/ui"

import type {
  AdminBooking,
  BookingService,
  BookingStatus,
} from "../../../types/adminBooking"

import type {
  AdminCustomer,
  CustomerLevel,
} from "../types/adminCustomer"

import "./CustomerDetailsDrawer.css"

interface CustomerDetailsDrawerProps {
  customer: AdminCustomer | null
  isOpen: boolean
  onClose: () => void
}

interface LoyaltyProgress {
  confirmedVisits: number
  completedCycles: number
  currentCycleVisits: number
  nextRewardAt: number
  visitsUntilReward: number
  rewardName: string
  progressPercentage: number
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

function formatDate(
  date: string | null,
): string {
  if (!date) {
    return "—"
  }

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

function getCustomerName(
  customer: AdminCustomer,
): string {
  return [
    customer.firstName,
    customer.lastName,
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

function getCustomerLevelName(
  level: CustomerLevel,
): string {
  if (level === "vip") {
    return "VIP Customer"
  }

  if (level === "returning") {
    return "Returning Customer"
  }

  return "Standard Customer"
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

function getDaysSinceDate(
  date: string | null,
): number | null {
  if (!date) {
    return null
  }

  const selectedDate = new Date(
    `${date}T00:00:00`,
  )

  const today = new Date()

  today.setHours(0, 0, 0, 0)

  const difference =
    today.getTime() -
    selectedDate.getTime()

  return Math.max(
    0,
    Math.floor(
      difference /
        (1000 * 60 * 60 * 24),
    ),
  )
}

function getLoyaltyProgress(
  confirmedVisits: number,
): LoyaltyProgress {
  const completedCycles = Math.floor(
    confirmedVisits / 12,
  )

  const currentCycleVisits =
    confirmedVisits % 12

  const nextRewardAt =
    currentCycleVisits < 6
      ? 6
      : 12

  const visitsUntilReward =
    nextRewardAt - currentCycleVisits

  const rewardName =
    nextRewardAt === 6
      ? "Interior Air Freshener"
      : "Free Wash"

  const progressPercentage =
    Math.min(
      100,
      (currentCycleVisits / 12) * 100,
    )

  return {
    confirmedVisits,
    completedCycles,
    currentCycleVisits,
    nextRewardAt,
    visitsUntilReward,
    rewardName,
    progressPercentage,
  }
}

function CustomerDetailsDrawer({
  customer,
  isOpen,
  onClose,
}: CustomerDetailsDrawerProps) {
  const sortedBookings = useMemo(() => {
    if (!customer) {
      return []
    }

    return [...customer.bookings].sort(
      (firstBooking, secondBooking) => {
        const firstDate =
          `${firstBooking.booking_date} ${firstBooking.booking_time}`

        const secondDate =
          `${secondBooking.booking_date} ${secondBooking.booking_time}`

        return secondDate.localeCompare(
          firstDate,
        )
      },
    )
  }, [customer])

  const loyaltyProgress = useMemo(() => {
    return getLoyaltyProgress(
      customer?.confirmedBookingsCount ?? 0,
    )
  }, [customer])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    )

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow =
      "hidden"

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      )

      document.body.style.overflow =
        previousOverflow
    }
  }, [
    isOpen,
    onClose,
  ])

  if (!isOpen || !customer) {
    return null
  }

  const daysSinceLastVisit =
    getDaysSinceDate(
      customer.lastVisitDate,
    )

  return (
    <div
      className="customer-drawer-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose()
        }
      }}
    >
      <aside
        className="customer-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="customer-drawer-title"
      >
        <header className="customer-drawer__header">
          <div>
            <div className="customer-drawer__title-row">
              <h2 id="customer-drawer-title">
                {getCustomerName(customer)}
              </h2>

              <span
                className={`customer-level customer-level--${customer.level}`}
              >
                {getCustomerLevelName(
                  customer.level,
                )}
              </span>
            </div>

            <p>
              Customer details and complete
              booking history.
            </p>
          </div>

          <button
            type="button"
            className="customer-drawer__close"
            aria-label="Close customer details"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <div className="customer-drawer__body">
          <section className="customer-drawer__section">
            <div className="customer-drawer__section-header">
              <h3>Contact Information</h3>
            </div>

            <div className="customer-info-grid">
              <div className="customer-info-item">
                <span>Phone</span>

                <strong>
                  {customer.phone ||
                    "No phone"}
                </strong>
              </div>

              <div className="customer-info-item">
                <span>Email</span>

                <strong>
                  {customer.email ||
                    "No email"}
                </strong>
              </div>

              <div className="customer-info-item">
                <span>Status</span>

                <AdminBadge
                  variant={
                    customer.status ===
                    "active"
                      ? "success"
                      : "neutral"
                  }
                >
                  {customer.status ===
                  "active"
                    ? "Active"
                    : "Inactive"}
                </AdminBadge>
              </div>

              <div className="customer-info-item">
                <span>Customer Since</span>

                <strong>
                  {formatDate(
                    customer.customerSince,
                  )}
                </strong>
              </div>
            </div>
          </section>

          <section className="customer-drawer__section">
            <div className="customer-drawer__section-header">
              <h3>Customer Statistics</h3>
            </div>

            <div className="customer-statistics-grid">
              <div className="customer-statistic-card">
                <span>Total Bookings</span>

                <strong>
                  {customer.bookingsCount}
                </strong>
              </div>

              <div className="customer-statistic-card">
                <span>Confirmed</span>

                <strong>
                  {
                    customer.confirmedBookingsCount
                  }
                </strong>
              </div>

              <div className="customer-statistic-card">
                <span>Cancelled</span>

                <strong>
                  {
                    customer.cancelledBookingsCount
                  }
                </strong>
              </div>

              <div className="customer-statistic-card">
                <span>Total Spent</span>

                <strong>
                  {formatCurrency(
                    customer.totalSpent,
                  )}
                </strong>
              </div>

              <div className="customer-statistic-card">
                <span>Average Ticket</span>

                <strong>
                  {formatCurrency(
                    customer.averageTicket,
                  )}
                </strong>
              </div>

              <div className="customer-statistic-card">
                <span>Days Since Last Visit</span>

                <strong>
                  {daysSinceLastVisit ??
                    "—"}
                </strong>
              </div>
            </div>
          </section>

          <section className="customer-drawer__section customer-loyalty-section">
            <div className="customer-drawer__section-header">
              <div>
                <h3>Loyalty Program</h3>

                <p className="customer-loyalty-section__subtitle">
                  Only confirmed bookings count
                  toward rewards.
                </p>
              </div>

              <span>
                Cycle{" "}
                {loyaltyProgress.completedCycles +
                  1}
              </span>
            </div>

            <div className="customer-loyalty__summary">
              <div className="customer-loyalty__main">
                <span>Current progress</span>

                <strong>
                  {
                    loyaltyProgress.currentCycleVisits
                  }
                  /12
                </strong>
              </div>

              <div className="customer-loyalty__next-reward">
                <span>Next reward</span>

                <strong>
                  {
                    loyaltyProgress.rewardName
                  }
                </strong>

                <small>
                  {
                    loyaltyProgress.visitsUntilReward
                  }{" "}
                  {loyaltyProgress.visitsUntilReward ===
                  1
                    ? "visit"
                    : "visits"}{" "}
                  remaining
                </small>
              </div>
            </div>

            <div
              className="customer-loyalty__progress"
              aria-label={`${loyaltyProgress.currentCycleVisits} of 12 confirmed visits`}
            >
              <div
                className="customer-loyalty__progress-value"
                style={{
                  width:
                    `${loyaltyProgress.progressPercentage}%`,
                }}
              />
            </div>

            <div className="customer-loyalty__milestones">
              {Array.from(
                { length: 12 },
                (_, index) => {
                  const visitNumber =
                    index + 1

                  const isCompleted =
                    visitNumber <=
                    loyaltyProgress.currentCycleVisits

                  const isGift =
                    visitNumber === 6

                  const isFreeWash =
                    visitNumber === 12

                  return (
                    <div
                      key={visitNumber}
                      className={[
                        "customer-loyalty__stamp",
                        isCompleted
                          ? "customer-loyalty__stamp--completed"
                          : "",
                        isGift
                          ? "customer-loyalty__stamp--gift"
                          : "",
                        isFreeWash
                          ? "customer-loyalty__stamp--free"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      title={
                        isGift
                          ? "Interior Air Freshener"
                          : isFreeWash
                            ? "Free Wash"
                            : `Visit ${visitNumber}`
                      }
                    >
                      {isGift
                        ? "🎁"
                        : isFreeWash
                          ? "FREE"
                          : visitNumber}
                    </div>
                  )
                },
              )}
            </div>

            <div className="customer-loyalty__rewards">
              <div>
                <span>Visit 6</span>

                <strong>
                  Interior Air Freshener
                </strong>
              </div>

              <div>
                <span>Visit 12</span>

                <strong>Free Wash</strong>
              </div>
            </div>

            {loyaltyProgress.completedCycles >
              0 && (
              <div className="customer-loyalty__completed">
                <strong>
                  {
                    loyaltyProgress.completedCycles
                  }
                </strong>

                <span>
                  {loyaltyProgress.completedCycles ===
                  1
                    ? "complete loyalty cycle"
                    : "complete loyalty cycles"}
                </span>
              </div>
            )}
          </section>

          <section className="customer-drawer__section">
            <div className="customer-drawer__section-header">
              <h3>Vehicles</h3>
            </div>

            {customer.vehicles.length ===
            0 ? (
              <p className="customer-drawer__empty">
                No vehicles registered.
              </p>
            ) : (
              <div className="customer-vehicle-list">
                {customer.vehicles.map(
                  (vehicle, index) => (
                    <div
                      key={`${vehicle}-${index}`}
                      className="customer-vehicle-card"
                    >
                      <strong>
                        {vehicle}
                      </strong>

                      <span>
                        Plate:{" "}
                        {customer
                          .licensePlates[
                          index
                        ] || "Not informed"}
                      </span>
                    </div>
                  ),
                )}
              </div>
            )}
          </section>

          <section className="customer-drawer__section">
            <div className="customer-drawer__section-header">
              <h3>Visits</h3>
            </div>

            <div className="customer-visit-grid">
              <div className="customer-info-item">
                <span>Last Visit</span>

                <strong>
                  {formatDate(
                    customer.lastVisitDate,
                  )}
                </strong>
              </div>

              <div className="customer-info-item">
                <span>Next Booking</span>

                <strong>
                  {formatDate(
                    customer.nextBookingDate,
                  )}
                </strong>
              </div>
            </div>
          </section>

          <section className="customer-drawer__section">
            <div className="customer-drawer__section-header">
              <h3>Booking History</h3>

              <span>
                {sortedBookings.length}{" "}
                records
              </span>
            </div>

            {sortedBookings.length ===
            0 ? (
              <p className="customer-drawer__empty">
                No booking history.
              </p>
            ) : (
              <div className="customer-history">
                {sortedBookings.map(
                  (booking) => (
                    <article
                      key={booking.id}
                      className={`customer-history-item customer-history-item--${booking.status}`}
                    >
                      <div className="customer-history-item__marker" />

                      <div className="customer-history-item__content">
                        <div className="customer-history-item__header">
                          <div>
                            <strong>
                              {getServiceName(
                                booking.service,
                              )}
                            </strong>

                            <span>
                              {formatDate(
                                booking.booking_date,
                              )}
                              {" at "}
                              {formatTime(
                                booking.booking_time,
                              )}
                            </span>
                          </div>

                          <AdminBadge
                            variant={
                              booking.status
                            }
                          >
                            {getStatusName(
                              booking.status,
                            )}
                          </AdminBadge>
                        </div>

                        <div className="customer-history-item__details">
                          <span>
                            {getVehicleDescription(
                              booking,
                            ) ||
                              "Vehicle not informed"}
                          </span>

                          <span>
                            Plate:{" "}
                            {booking.license_plate ||
                              "Not informed"}
                          </span>

                          <strong>
                            {booking.status ===
                            "cancelled"
                              ? formatCurrency(
                                  0,
                                )
                              : formatCurrency(
                                  Number(
                                    booking.price,
                                  ) || 0,
                                )}
                          </strong>
                        </div>
                      </div>
                    </article>
                  ),
                )}
              </div>
            )}
          </section>
        </div>

        <footer className="customer-drawer__footer">
          <AdminButton
            variant="secondary"
            onClick={onClose}
          >
            Close
          </AdminButton>
        </footer>
      </aside>
    </div>
  )
}

export default CustomerDetailsDrawer