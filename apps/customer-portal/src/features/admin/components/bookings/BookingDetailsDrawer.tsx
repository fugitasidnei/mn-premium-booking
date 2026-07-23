import "./BookingDetailsDrawer.css"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import {
  AdminBadge,
  AdminButton,
} from "../layout/ui"

import {
  useBookingTimeline,
} from "../../../../hooks/useBookingTimeline"

import type {
  AdminBooking,
  BookingService,
  BookingStatus,
} from "../../../../types/adminBooking"

type BookingDetailsTab =
  | "overview"
  | "history"
  | "loyalty"
  | "notes"
  | "timeline"

type CustomerLevel =
  | "standard"
  | "returning"
  | "vip"

type BookingDetailsDrawerProps = {
  booking: AdminBooking | null
  allBookings?: AdminBooking[]
  actionBookingId: string | null
  onClose: () => void
  onEdit: () => void
  onConfirm: (
    bookingId: string,
  ) => Promise<void>
  onCancel: (
    bookingId: string,
  ) => Promise<void>
}

interface CustomerStatistics {
  customerBookings: AdminBooking[]
  confirmedBookings: AdminBooking[]
  cancelledBookings: AdminBooking[]
  totalBookings: number
  confirmedCount: number
  cancelledCount: number
  totalSpent: number
  averageTicket: number
  firstBookingDate: string | null
  lastBookingDate: string | null
  level: CustomerLevel
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

function normalizeText(
  value: unknown,
): string {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase()
}

function normalizePhone(
  value: string,
): string {
  return value.replace(/\D/g, "")
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

function getCustomerName(
  booking: AdminBooking,
): string {
  return [
    booking.first_name,
    booking.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim()
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

function getCustomerLevel(
  confirmedBookings: number,
): CustomerLevel {
  if (confirmedBookings >= 12) {
    return "vip"
  }

  if (confirmedBookings >= 2) {
    return "returning"
  }

  return "standard"
}

function getCustomerLevelLabel(
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

function getCustomerLevelVariant(
  level: CustomerLevel,
):
  | "success"
  | "warning"
  | "neutral" {
  if (level === "vip") {
    return "success"
  }

  if (level === "returning") {
    return "warning"
  }

  return "neutral"
}

function isSameCustomer(
  selectedBooking: AdminBooking,
  comparedBooking: AdminBooking,
): boolean {
  const selectedEmail =
    normalizeText(
      selectedBooking.email,
    )

  const comparedEmail =
    normalizeText(
      comparedBooking.email,
    )

  if (
    selectedEmail &&
    comparedEmail &&
    selectedEmail === comparedEmail
  ) {
    return true
  }

  const selectedPhone =
    normalizePhone(
      selectedBooking.phone,
    )

  const comparedPhone =
    normalizePhone(
      comparedBooking.phone,
    )

  if (
    selectedPhone &&
    comparedPhone &&
    selectedPhone === comparedPhone
  ) {
    return true
  }

  const selectedName =
    normalizeText(
      getCustomerName(
        selectedBooking,
      ),
    )

  const comparedName =
    normalizeText(
      getCustomerName(
        comparedBooking,
      ),
    )

  return (
    Boolean(selectedName) &&
    selectedName === comparedName
  )
}

function getCustomerStatistics(
  booking: AdminBooking,
  allBookings: AdminBooking[],
): CustomerStatistics {
  const sourceBookings =
    allBookings.length > 0
      ? allBookings
      : [booking]

  const customerBookings =
    sourceBookings
      .filter((currentBooking) =>
        isSameCustomer(
          booking,
          currentBooking,
        ),
      )
      .sort(
        (
          firstBooking,
          secondBooking,
        ) => {
          const firstDateTime =
            `${firstBooking.booking_date} ${firstBooking.booking_time}`

          const secondDateTime =
            `${secondBooking.booking_date} ${secondBooking.booking_time}`

          return secondDateTime.localeCompare(
            firstDateTime,
          )
        },
      )

  const confirmedBookings =
    customerBookings.filter(
      (currentBooking) =>
        currentBooking.status ===
        "confirmed",
    )

  const cancelledBookings =
    customerBookings.filter(
      (currentBooking) =>
        currentBooking.status ===
        "cancelled",
    )

  const totalSpent =
    confirmedBookings.reduce(
      (total, currentBooking) =>
        total +
        (Number(
          currentBooking.price,
        ) || 0),
      0,
    )

  const averageTicket =
    confirmedBookings.length > 0
      ? totalSpent /
        confirmedBookings.length
      : 0

  const chronologicalBookings =
    [...customerBookings].sort(
      (
        firstBooking,
        secondBooking,
      ) =>
        firstBooking.booking_date
          .localeCompare(
            secondBooking.booking_date,
          ),
    )

  return {
    customerBookings,
    confirmedBookings,
    cancelledBookings,
    totalBookings:
      customerBookings.length,
    confirmedCount:
      confirmedBookings.length,
    cancelledCount:
      cancelledBookings.length,
    totalSpent,
    averageTicket,
    firstBookingDate:
      chronologicalBookings[0]
        ?.booking_date ?? null,
    lastBookingDate:
      customerBookings[0]
        ?.booking_date ?? null,
    level: getCustomerLevel(
      confirmedBookings.length,
    ),
  }
}

function getLoyaltyProgress(
  confirmedVisits: number,
): LoyaltyProgress {
  const completedCycles =
    Math.floor(
      confirmedVisits / 12,
    )

  const currentCycleVisits =
    confirmedVisits % 12

  const nextRewardAt =
    currentCycleVisits < 6
      ? 6
      : 12

  const visitsUntilReward =
    nextRewardAt -
    currentCycleVisits

  const rewardName =
    nextRewardAt === 6
      ? "Interior Air Freshener"
      : "Free Wash"

  const progressPercentage =
    Math.min(
      100,
      (currentCycleVisits / 12) *
        100,
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

function BookingDetailsDrawer({
  booking,
  allBookings = [],
  actionBookingId,
  onClose,
  onEdit,
  onConfirm,
  onCancel,
}: BookingDetailsDrawerProps) {
  const [
    activeTab,
    setActiveTab,
  ] =
    useState<BookingDetailsTab>(
      "overview",
    )

  const {
    timeline,
    isLoading: isTimelineLoading,
    error: timelineError,
  } = useBookingTimeline(
    booking?.id ?? null,
  )

  const customerStatistics =
    useMemo(() => {
      if (!booking) {
        return null
      }

      return getCustomerStatistics(
        booking,
        allBookings,
      )
    }, [
      booking,
      allBookings,
    ])

  const loyaltyProgress =
    useMemo(() => {
      return getLoyaltyProgress(
        customerStatistics
          ?.confirmedCount ?? 0,
      )
    }, [customerStatistics])

  useEffect(() => {
    if (!booking) {
      return undefined
    }

    setActiveTab("overview")

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
    booking,
    onClose,
  ])

  if (
    !booking ||
    !customerStatistics
  ) {
    return null
  }

  const isActionLoading =
    actionBookingId === booking.id

  const customerName =
    getCustomerName(booking) ||
    "Customer"

  async function handleConfirm() {
    if (!booking) {
      return
    }

    await onConfirm(booking.id)
  }

  async function handleCancel() {
    if (!booking) {
      return
    }

    const shouldCancel =
      window.confirm(
        "Are you sure you want to cancel this booking?",
      )

    if (!shouldCancel) {
      return
    }

    await onCancel(booking.id)
  }

  return (
    <div
      className="booking-details-overlay"
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
        aria-labelledby="booking-details-title"
        aria-modal="true"
        className="booking-details-drawer"
        role="dialog"
      >
        <header className="booking-details-drawer__header">
          <div>
            <span className="booking-details-drawer__eyebrow">
              Booking details
            </span>

            <h2 id="booking-details-title">
              {customerName}
            </h2>

            <div className="booking-details-drawer__badges">
              <AdminBadge
                variant={getStatusVariant(
                  booking.status,
                )}
              >
                {getStatusLabel(
                  booking.status,
                )}
              </AdminBadge>

              <AdminBadge
                variant={getCustomerLevelVariant(
                  customerStatistics.level,
                )}
              >
                {getCustomerLevelLabel(
                  customerStatistics.level,
                )}
              </AdminBadge>
            </div>
          </div>

          <button
            aria-label="Close booking details"
            className="booking-details-drawer__close"
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </header>

        <nav
          aria-label="Booking details sections"
          className="booking-details-tabs"
        >
          <button
            className={
              activeTab === "overview"
                ? "booking-details-tab booking-details-tab--active"
                : "booking-details-tab"
            }
            type="button"
            onClick={() =>
              setActiveTab("overview")
            }
          >
            Overview
          </button>

          <button
            className={
              activeTab === "history"
                ? "booking-details-tab booking-details-tab--active"
                : "booking-details-tab"
            }
            type="button"
            onClick={() =>
              setActiveTab("history")
            }
          >
            History
          </button>

          <button
            className={
              activeTab === "loyalty"
                ? "booking-details-tab booking-details-tab--active"
                : "booking-details-tab"
            }
            type="button"
            onClick={() =>
              setActiveTab("loyalty")
            }
          >
            Loyalty
          </button>

          <button
            className={
              activeTab === "notes"
                ? "booking-details-tab booking-details-tab--active"
                : "booking-details-tab"
            }
            type="button"
            onClick={() =>
              setActiveTab("notes")
            }
          >
            Notes
          </button>

          <button
            className={
              activeTab === "timeline"
                ? "booking-details-tab booking-details-tab--active"
                : "booking-details-tab"
            }
            type="button"
            onClick={() =>
              setActiveTab("timeline")
            }
          >
            Timeline
          </button>
        </nav>

        <div className="booking-details-drawer__content">
          {activeTab === "overview" && (
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
                        Number(
                          booking.price,
                        ) || 0,
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
                      <a
                        href={`tel:${booking.phone}`}
                      >
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
                      <a
                        href={`mailto:${booking.email}`}
                      >
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
                      {
                        customerStatistics.totalBookings
                      }
                    </strong>
                  </div>

                  <div>
                    <span>Confirmed</span>

                    <strong>
                      {
                        customerStatistics.confirmedCount
                      }
                    </strong>
                  </div>

                  <div>
                    <span>Cancelled</span>

                    <strong>
                      {
                        customerStatistics.cancelledCount
                      }
                    </strong>
                  </div>

                  <div>
                    <span>Total spent</span>

                    <strong>
                      {formatCurrency(
                        customerStatistics.totalSpent,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Average ticket</span>

                    <strong>
                      {formatCurrency(
                        customerStatistics.averageTicket,
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Customer since</span>

                    <strong>
                      {formatDate(
                        customerStatistics.firstBookingDate,
                      )}
                    </strong>
                  </div>
                </div>
              </section>
            </>
          )}

          {activeTab === "history" && (
            <section className="booking-details-section">
              <div className="booking-details-section__header">
                <h3>Booking History</h3>

                <span>
                  {
                    customerStatistics.totalBookings
                  }{" "}
                  records
                </span>
              </div>

              <div className="booking-details-history">
                {customerStatistics.customerBookings.map(
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
          )}

          {activeTab === "loyalty" && (
            <section className="booking-details-section">
              <div className="booking-details-section__header">
                <div>
                  <h3>Loyalty Program</h3>

                  <p className="booking-loyalty__subtitle">
                    Only confirmed bookings
                    count toward rewards.
                  </p>
                </div>

                <span>
                  Cycle{" "}
                  {loyaltyProgress.completedCycles +
                    1}
                </span>
              </div>

              <div className="booking-loyalty__summary">
                <div>
                  <span>
                    Current progress
                  </span>

                  <strong>
                    {
                      loyaltyProgress.currentCycleVisits
                    }
                    /12
                  </strong>
                </div>

                <div>
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
                aria-label={`${loyaltyProgress.currentCycleVisits} of 12 confirmed visits`}
                className="booking-loyalty__progress"
              >
                <div
                  className="booking-loyalty__progress-value"
                  style={{
                    width:
                      `${loyaltyProgress.progressPercentage}%`,
                  }}
                />
              </div>

              <div className="booking-loyalty__stamps">
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
                        className={[
                          "booking-loyalty__stamp",
                          isCompleted
                            ? "booking-loyalty__stamp--completed"
                            : "",
                          isGift
                            ? "booking-loyalty__stamp--gift"
                            : "",
                          isFreeWash
                            ? "booking-loyalty__stamp--free"
                            : "",
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        key={visitNumber}
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

              <div className="booking-loyalty__rewards">
                <div>
                  <span>Visit 6</span>

                  <strong>
                    Interior Air Freshener
                  </strong>
                </div>

                <div>
                  <span>Visit 12</span>

                  <strong>
                    Free Wash
                  </strong>
                </div>
              </div>

              {loyaltyProgress.completedCycles >
                0 && (
                <div className="booking-loyalty__completed">
                  <strong>
                    {
                      loyaltyProgress.completedCycles
                    }
                  </strong>

                  <span>
                    {loyaltyProgress.completedCycles ===
                    1
                      ? "completed loyalty cycle"
                      : "completed loyalty cycles"}
                  </span>
                </div>
              )}
            </section>
          )}

          {activeTab === "notes" && (
            <section className="booking-details-section">
              <div className="booking-details-section__header">
                <h3>Booking Notes</h3>
              </div>

              <div className="booking-details-notes">
                {booking.notes?.trim() ? (
                  <p>{booking.notes}</p>
                ) : (
                  <p className="booking-details-empty">
                    No notes were added to
                    this booking.
                  </p>
                )}
              </div>
            </section>
          )}

          {activeTab === "timeline" && (
            <section className="booking-details-section">
              <div className="booking-details-section__header">
                <h3>Booking Timeline</h3>

                {!isTimelineLoading &&
                  !timelineError && (
                    <span>
                      {timeline.length}{" "}
                      {timeline.length === 1
                        ? "event"
                        : "events"}
                    </span>
                  )}
              </div>

              {isTimelineLoading && (
                <p className="booking-details-empty">
                  Loading timeline...
                </p>
              )}

              {timelineError && (
                <p className="booking-details-empty">
                  {timelineError}
                </p>
              )}

              {!isTimelineLoading &&
                !timelineError &&
                timeline.length === 0 && (
                  <p className="booking-details-empty">
                    No timeline events were
                    registered for this
                    booking yet.
                  </p>
                )}

              {!isTimelineLoading &&
                !timelineError &&
                timeline.length > 0 && (
                  <div className="booking-details-timeline">
                    {timeline.map(
                      (timelineEvent) => (
                        <article
                          className={getTimelineItemClass(
                            timelineEvent.event_type,
                          )}
                          key={
                            timelineEvent.id
                          }
                        >
                          <div className="booking-timeline-item__marker" />

                          <div>
                            <strong>
                              {
                                timelineEvent.title
                              }
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
                              {
                                timelineEvent.created_by
                              }
                            </span>
                          </div>
                        </article>
                      ),
                    )}
                  </div>
                )}
            </section>
          )}
        </div>

        <footer className="booking-details-drawer__footer">
          <AdminButton
            variant="secondary"
            disabled={isActionLoading}
            onClick={onClose}
          >
            Close
          </AdminButton>

          <AdminButton
            variant="primary"
            disabled={isActionLoading}
            onClick={onEdit}
          >
            Edit booking
          </AdminButton>

          {booking.status !==
            "cancelled" && (
            <AdminButton
              variant="danger"
              disabled={isActionLoading}
              onClick={() => {
                void handleCancel()
              }}
            >
              {isActionLoading
                ? "Processing..."
                : "Cancel booking"}
            </AdminButton>
          )}

          {booking.status !==
            "confirmed" && (
            <AdminButton
              variant="success"
              disabled={isActionLoading}
              onClick={() => {
                void handleConfirm()
              }}
            >
              {isActionLoading
                ? "Processing..."
                : "Confirm booking"}
            </AdminButton>
          )}
        </footer>
      </aside>
    </div>
  )
}

export default BookingDetailsDrawer