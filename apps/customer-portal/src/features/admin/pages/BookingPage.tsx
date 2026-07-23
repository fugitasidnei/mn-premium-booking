import {
  useEffect,
  useMemo,
  useState,
} from "react"

import BookingDetailsDrawer from "../components/bookings/BookingDetailsDrawer"
import EditBookingDrawer from "../components/EditBookingDrawer"

import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminTable,
} from "../components/layout/ui"

import {
  useAdminBookings,
} from "../../../hooks/useAdminBookings"

import type {
  AdminBooking,
  BookingService,
  BookingStatus,
} from "../../../types/adminBooking"

import "./BookingPage.css"

type StatusFilter =
  | "all"
  | BookingStatus

type ServiceFilter =
  | "all"
  | BookingService

type DateFilter =
  | "all"
  | "today"
  | "tomorrow"
  | "upcoming"
  | "past"

type SortField =
  | "date"
  | "customer"
  | "service"
  | "price"
  | "status"

type SortDirection =
  | "ascending"
  | "descending"

interface SortSettings {
  field: SortField
  direction: SortDirection
}

const PAGE_SIZE_OPTIONS = [
  10,
  20,
  50,
]

function normalizeText(
  value: unknown,
): string {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase()
}

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

function getTomorrowDateString(): string {
  const tomorrow = new Date()

  tomorrow.setDate(
    tomorrow.getDate() + 1,
  )

  return getLocalDateString(tomorrow)
}

function formatDate(
  value: string,
): string {
  const [year, month, day] =
    value.split("-")

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
  if (status === "confirmed") {
    return "confirmed"
  }

  if (status === "cancelled") {
    return "cancelled"
  }

  return "pending"
}

function getBookingPrice(
  booking: AdminBooking,
): number {
  return Number(booking.price) || 0
}

function getBookingDateTime(
  booking: AdminBooking,
): string {
  return [
    booking.booking_date,
    booking.booking_time,
  ].join(" ")
}

function matchesSearch(
  booking: AdminBooking,
  searchTerm: string,
): boolean {
  if (!searchTerm) {
    return true
  }

  const searchableContent = [
    booking.first_name,
    booking.last_name,
    getCustomerName(booking),
    booking.phone,
    booking.email,
    booking.vehicle,
    booking.model,
    booking.license_plate,
    booking.booking_date,
    booking.booking_time,
    booking.service,
    getServiceLabel(booking.service),
    booking.status,
    getStatusLabel(booking.status),
  ]
    .map(normalizeText)
    .join(" ")

  return searchableContent.includes(
    searchTerm,
  )
}

function matchesDateFilter(
  booking: AdminBooking,
  dateFilter: DateFilter,
): boolean {
  const today = getLocalDateString()

  if (dateFilter === "today") {
    return booking.booking_date === today
  }

  if (dateFilter === "tomorrow") {
    return (
      booking.booking_date ===
      getTomorrowDateString()
    )
  }

  if (dateFilter === "upcoming") {
    return booking.booking_date >= today
  }

  if (dateFilter === "past") {
    return booking.booking_date < today
  }

  return true
}

function compareBookings(
  firstBooking: AdminBooking,
  secondBooking: AdminBooking,
  sortSettings: SortSettings,
): number {
  let comparison = 0

  if (sortSettings.field === "date") {
    comparison = getBookingDateTime(
      firstBooking,
    ).localeCompare(
      getBookingDateTime(secondBooking),
    )
  }

  if (
    sortSettings.field === "customer"
  ) {
    comparison = getCustomerName(
      firstBooking,
    ).localeCompare(
      getCustomerName(secondBooking),
    )
  }

  if (
    sortSettings.field === "service"
  ) {
    comparison = getServiceLabel(
      firstBooking.service,
    ).localeCompare(
      getServiceLabel(
        secondBooking.service,
      ),
    )
  }

  if (sortSettings.field === "price") {
    comparison =
      getBookingPrice(firstBooking) -
      getBookingPrice(secondBooking)
  }

  if (
    sortSettings.field === "status"
  ) {
    comparison =
      firstBooking.status.localeCompare(
        secondBooking.status,
      )
  }

  if (
    sortSettings.direction ===
    "descending"
  ) {
    return comparison * -1
  }

  return comparison
}

function BookingPage() {
  const {
    bookings,
    isLoading,
    error,
    actionBookingId,
    refreshBookings,
    confirmBooking,
    cancelBooking,
  } = useAdminBookings()

  const [search, setSearch] =
    useState("")

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<StatusFilter>("all")

  const [
    serviceFilter,
    setServiceFilter,
  ] = useState<ServiceFilter>("all")

  const [
    dateFilter,
    setDateFilter,
  ] = useState<DateFilter>("all")

  const [
    sortSettings,
    setSortSettings,
  ] = useState<SortSettings>({
    field: "date",
    direction: "ascending",
  })

  const [pageSize, setPageSize] =
    useState(10)

  const [currentPage, setCurrentPage] =
    useState(1)

  const [
    selectedBookingId,
    setSelectedBookingId,
  ] = useState<string | null>(null)

  const [
    isEditBookingOpen,
    setIsEditBookingOpen,
  ] = useState(false)

  const normalizedSearch =
    normalizeText(search)

  const selectedBooking =
    useMemo(() => {
      if (!selectedBookingId) {
        return null
      }

      return (
        bookings.find(
          (booking) =>
            booking.id ===
            selectedBookingId,
        ) ?? null
      )
    }, [
      bookings,
      selectedBookingId,
    ])

  const summary = useMemo(() => {
    const activeBookings =
      bookings.filter(
        (booking) =>
          booking.status !== "cancelled",
      )

    const totalRevenue =
      activeBookings.reduce(
        (total, booking) =>
          total +
          getBookingPrice(booking),
        0,
      )

    return {
      total: bookings.length,

      pending: bookings.filter(
        (booking) =>
          booking.status === "pending",
      ).length,

      confirmed: bookings.filter(
        (booking) =>
          booking.status === "confirmed",
      ).length,

      cancelled: bookings.filter(
        (booking) =>
          booking.status === "cancelled",
      ).length,

      totalRevenue,

      averageTicket:
        activeBookings.length > 0
          ? totalRevenue /
            activeBookings.length
          : 0,

      exterior: activeBookings.filter(
        (booking) =>
          booking.service === "exterior",
      ).length,

      premium: activeBookings.filter(
        (booking) =>
          booking.service === "premium",
      ).length,
    }
  }, [bookings])

  const filteredBookings =
    useMemo(() => {
      return [...bookings]
        .filter((booking) =>
          matchesSearch(
            booking,
            normalizedSearch,
          ),
        )
        .filter((booking) => {
          if (statusFilter === "all") {
            return true
          }

          return (
            booking.status ===
            statusFilter
          )
        })
        .filter((booking) => {
          if (serviceFilter === "all") {
            return true
          }

          return (
            booking.service ===
            serviceFilter
          )
        })
        .filter((booking) =>
          matchesDateFilter(
            booking,
            dateFilter,
          ),
        )
        .sort(
          (
            firstBooking,
            secondBooking,
          ) =>
            compareBookings(
              firstBooking,
              secondBooking,
              sortSettings,
            ),
        )
    }, [
      bookings,
      normalizedSearch,
      statusFilter,
      serviceFilter,
      dateFilter,
      sortSettings,
    ])

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredBookings.length /
        pageSize,
    ),
  )

  const paginatedBookings =
    useMemo(() => {
      const firstIndex =
        (currentPage - 1) * pageSize

      return filteredBookings.slice(
        firstIndex,
        firstIndex + pageSize,
      )
    }, [
      currentPage,
      filteredBookings,
      pageSize,
    ])

  useEffect(() => {
    setCurrentPage(1)
  }, [
    search,
    statusFilter,
    serviceFilter,
    dateFilter,
    pageSize,
  ])

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [
    currentPage,
    totalPages,
  ])

  useEffect(() => {
    if (
      selectedBookingId &&
      !selectedBooking
    ) {
      setSelectedBookingId(null)
    }
  }, [
    selectedBooking,
    selectedBookingId,
  ])

  function updateSort(
    field: SortField,
  ) {
    setSortSettings(
      (currentSettings) => {
        if (
          currentSettings.field === field
        ) {
          return {
            field,
            direction:
              currentSettings.direction ===
              "ascending"
                ? "descending"
                : "ascending",
          }
        }

        return {
          field,
          direction: "ascending",
        }
      },
    )
  }

  function getSortSymbol(
    field: SortField,
  ): string {
    if (sortSettings.field !== field) {
      return "↕"
    }

    if (
      sortSettings.direction ===
      "ascending"
    ) {
      return "↑"
    }

    return "↓"
  }

  function clearFilters() {
    setSearch("")
    setStatusFilter("all")
    setServiceFilter("all")
    setDateFilter("all")
    setCurrentPage(1)
  }

  function applySummaryFilter(
    status: StatusFilter,
  ) {
    setStatusFilter(status)
    setCurrentPage(1)
  }

  function openBookingDetails(
    bookingId: string,
  ) {
    setSelectedBookingId(bookingId)
  }

  function closeBookingDetails() {
    setSelectedBookingId(null)
    setIsEditBookingOpen(false)
  }

  function openEditBooking() {
    if (!selectedBooking) {
      return
    }

    setIsEditBookingOpen(true)
  }

  function closeEditBooking() {
    setIsEditBookingOpen(false)
  }

  async function handleConfirm(
    bookingId: string,
  ) {
    try {
      await confirmBooking(bookingId)
    } catch (confirmError) {
      console.error(
        "Error confirming booking:",
        confirmError,
      )
    }
  }

  async function handleCancel(
    bookingId: string,
  ) {
    const shouldCancel =
      window.confirm(
        "Are you sure you want to cancel this booking?",
      )

    if (!shouldCancel) {
      return
    }

    try {
      await cancelBooking(bookingId)
    } catch (cancelError) {
      console.error(
        "Error cancelling booking:",
        cancelError,
      )
    }
  }

  async function handleDrawerConfirm(
    bookingId: string,
  ) {
    try {
      await confirmBooking(bookingId)
    } catch (confirmError) {
      console.error(
        "Error confirming booking:",
        confirmError,
      )
    }
  }

  async function handleDrawerCancel(
    bookingId: string,
  ) {
    try {
      await cancelBooking(bookingId)
    } catch (cancelError) {
      console.error(
        "Error cancelling booking:",
        cancelError,
      )
    }
  }

  return (
    <>
      <section className="booking-manager">
        <header className="booking-manager__header">
          <div>
            <h1>Booking Manager</h1>

            <p>
              Search, organize and manage
              customer appointments.
            </p>
          </div>

          <div className="booking-manager__header-actions">
            <AdminButton
              variant="secondary"
              onClick={clearFilters}
            >
              Clear filters
            </AdminButton>

            <AdminButton
              variant="primary"
              disabled={isLoading}
              onClick={() => {
                void refreshBookings()
              }}
            >
              {isLoading
                ? "Refreshing..."
                : "Refresh bookings"}
            </AdminButton>
          </div>
        </header>

        <div className="booking-manager__summary">
          <button
            className={[
              "booking-summary-button",
              statusFilter === "all"
                ? "booking-summary-button--active"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            type="button"
            onClick={() => {
              applySummaryFilter("all")
            }}
          >
            <AdminCard className="booking-summary-card">
              <span>Total Bookings</span>

              <strong>
                {summary.total}
              </strong>
            </AdminCard>
          </button>

          <button
            className={[
              "booking-summary-button",
              statusFilter === "pending"
                ? "booking-summary-button--active"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            type="button"
            onClick={() => {
              applySummaryFilter("pending")
            }}
          >
            <AdminCard className="booking-summary-card">
              <span>Pending</span>

              <strong>
                {summary.pending}
              </strong>
            </AdminCard>
          </button>

          <button
            className={[
              "booking-summary-button",
              statusFilter === "confirmed"
                ? "booking-summary-button--active"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            type="button"
            onClick={() => {
              applySummaryFilter(
                "confirmed",
              )
            }}
          >
            <AdminCard className="booking-summary-card">
              <span>Confirmed</span>

              <strong>
                {summary.confirmed}
              </strong>
            </AdminCard>
          </button>

          <button
            className={[
              "booking-summary-button",
              statusFilter === "cancelled"
                ? "booking-summary-button--active"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            type="button"
            onClick={() => {
              applySummaryFilter(
                "cancelled",
              )
            }}
          >
            <AdminCard className="booking-summary-card">
              <span>Cancelled</span>

              <strong>
                {summary.cancelled}
              </strong>
            </AdminCard>
          </button>
        </div>

        <div className="booking-manager__metrics">
          <AdminCard className="booking-metric-card">
            <span>
              Scheduled Revenue
            </span>

            <strong>
              {formatCurrency(
                summary.totalRevenue,
              )}
            </strong>
          </AdminCard>

          <AdminCard className="booking-metric-card">
            <span>Average Ticket</span>

            <strong>
              {formatCurrency(
                summary.averageTicket,
              )}
            </strong>
          </AdminCard>

          <AdminCard className="booking-metric-card">
            <span>Exterior Wash</span>

            <strong>
              {summary.exterior}
            </strong>
          </AdminCard>

          <AdminCard className="booking-metric-card">
            <span>Premium Finish</span>

            <strong>
              {summary.premium}
            </strong>
          </AdminCard>
        </div>

        <AdminCard className="booking-manager__filters-card">
          <div className="booking-manager__filters">
            <label className="admin-field">
              <span className="admin-field__label">
                Search
              </span>

              <input
                className="admin-input"
                type="search"
                value={search}
                placeholder="Name, phone, email, vehicle, model or plate..."
                onChange={(event) => {
                  setSearch(
                    event.target.value,
                  )
                }}
              />
            </label>

            <label className="admin-field">
              <span className="admin-field__label">
                Date
              </span>

              <select
                className="admin-select"
                value={dateFilter}
                onChange={(event) => {
                  setDateFilter(
                    event.target
                      .value as DateFilter,
                  )
                }}
              >
                <option value="all">
                  All dates
                </option>

                <option value="today">
                  Today
                </option>

                <option value="tomorrow">
                  Tomorrow
                </option>

                <option value="upcoming">
                  Upcoming
                </option>

                <option value="past">
                  Past
                </option>
              </select>
            </label>

            <label className="admin-field">
              <span className="admin-field__label">
                Status
              </span>

              <select
                className="admin-select"
                value={statusFilter}
                onChange={(event) => {
                  setStatusFilter(
                    event.target
                      .value as StatusFilter,
                  )
                }}
              >
                <option value="all">
                  All statuses
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="confirmed">
                  Confirmed
                </option>

                <option value="cancelled">
                  Cancelled
                </option>
              </select>
            </label>

            <label className="admin-field">
              <span className="admin-field__label">
                Service
              </span>

              <select
                className="admin-select"
                value={serviceFilter}
                onChange={(event) => {
                  setServiceFilter(
                    event.target
                      .value as ServiceFilter,
                  )
                }}
              >
                <option value="all">
                  All services
                </option>

                <option value="exterior">
                  Exterior Wash
                </option>

                <option value="premium">
                  Premium Finish
                </option>
              </select>
            </label>

            <div className="booking-manager__clear-filter">
              <AdminButton
                variant="secondary"
                fullWidth
                onClick={clearFilters}
              >
                Clear
              </AdminButton>
            </div>
          </div>
        </AdminCard>

        {error && (
          <div className="booking-manager__error">
            {error}
          </div>
        )}

        <div className="booking-manager__results">
          <div>
            Showing{" "}
            <strong>
              {paginatedBookings.length}
            </strong>{" "}
            of{" "}
            <strong>
              {filteredBookings.length}
            </strong>{" "}
            matching bookings.
          </div>

          <div className="booking-manager__page-size">
            <label htmlFor="booking-page-size">
              Results per page
            </label>

            <select
              id="booking-page-size"
              className="booking-manager__page-size-select"
              value={pageSize}
              onChange={(event) => {
                setPageSize(
                  Number(
                    event.target.value,
                  ),
                )
              }}
            >
              {PAGE_SIZE_OPTIONS.map(
                (option) => (
                  <option
                    key={option}
                    value={option}
                  >
                    {option}
                  </option>
                ),
              )}
            </select>
          </div>
        </div>

        {isLoading &&
        bookings.length === 0 ? (
          <div className="booking-manager__message">
            Loading bookings...
          </div>
        ) : filteredBookings.length ===
          0 ? (
          <div className="booking-manager__message">
            No bookings match the selected
            filters.
          </div>
        ) : (
          <AdminTable minWidth={1280}>
            <thead>
              <tr>
                <th>
                  <button
                    className="booking-sort-button"
                    type="button"
                    onClick={() => {
                      updateSort("date")
                    }}
                  >
                    Date

                    <span>
                      {getSortSymbol("date")}
                    </span>
                  </button>
                </th>

                <th>
                  <button
                    className="booking-sort-button"
                    type="button"
                    onClick={() => {
                      updateSort(
                        "customer",
                      )
                    }}
                  >
                    Customer

                    <span>
                      {getSortSymbol(
                        "customer",
                      )}
                    </span>
                  </button>
                </th>

                <th>Contact</th>

                <th>
                  <button
                    className="booking-sort-button"
                    type="button"
                    onClick={() => {
                      updateSort("service")
                    }}
                  >
                    Service

                    <span>
                      {getSortSymbol(
                        "service",
                      )}
                    </span>
                  </button>
                </th>

                <th>Vehicle</th>

                <th>
                  <button
                    className="booking-sort-button"
                    type="button"
                    onClick={() => {
                      updateSort("price")
                    }}
                  >
                    Price

                    <span>
                      {getSortSymbol(
                        "price",
                      )}
                    </span>
                  </button>
                </th>

                <th>
                  <button
                    className="booking-sort-button"
                    type="button"
                    onClick={() => {
                      updateSort("status")
                    }}
                  >
                    Status

                    <span>
                      {getSortSymbol(
                        "status",
                      )}
                    </span>
                  </button>
                </th>

                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {paginatedBookings.map(
                (booking) => {
                  const isActionLoading =
                    actionBookingId ===
                    booking.id

                  return (
                    <tr
                      className={[
                        "booking-row",
                        `booking-row--${booking.status}`,
                      ].join(" ")}
                      key={booking.id}
                      tabIndex={0}
                      onClick={() => {
                        openBookingDetails(
                          booking.id,
                        )
                      }}
                      onKeyDown={(
                        event,
                      ) => {
                        if (
                          event.key ===
                            "Enter" ||
                          event.key === " "
                        ) {
                          event.preventDefault()

                          openBookingDetails(
                            booking.id,
                          )
                        }
                      }}
                    >
                      <td>
                        <div className="booking-table-cell">
                          <strong>
                            {formatDate(
                              booking.booking_date,
                            )}
                          </strong>

                          <small>
                            {formatTime(
                              booking.booking_time,
                            )}
                          </small>
                        </div>
                      </td>

                      <td>
                        <div className="booking-table-cell">
                          <strong>
                            {getCustomerName(
                              booking,
                            )}
                          </strong>

                          <small>
                            {booking.email ||
                              "No email"}
                          </small>
                        </div>
                      </td>

                      <td>
                        <div className="booking-table-cell">
                          <strong>
                            {booking.phone ||
                              "No phone"}
                          </strong>

                          <small>
                            {booking.email ||
                              "No email"}
                          </small>
                        </div>
                      </td>

                      <td>
                        <div className="booking-table-cell">
                          <strong>
                            {getServiceLabel(
                              booking.service,
                            )}
                          </strong>

                          <small>
                            {booking.plate_type ===
                            "yellow"
                              ? "Yellow plate"
                              : "White plate"}
                          </small>
                        </div>
                      </td>

                      <td>
                        <div className="booking-table-cell">
                          <strong>
                            {[
                              booking.vehicle,
                              booking.model,
                            ]
                              .filter(Boolean)
                              .join(" ") ||
                              "Not informed"}
                          </strong>

                          <small>
                            {booking.license_plate ||
                              "No plate"}
                          </small>
                        </div>
                      </td>

                      <td>
                        <strong>
                          {formatCurrency(
                            getBookingPrice(
                              booking,
                            ),
                          )}
                        </strong>
                      </td>

                      <td>
                        <AdminBadge
                          variant={getStatusVariant(
                            booking.status,
                          )}
                        >
                          {getStatusLabel(
                            booking.status,
                          )}
                        </AdminBadge>
                      </td>

                      <td>
                        <div className="booking-manager__actions">
                          <AdminButton
                            variant="secondary"
                            disabled={
                              isActionLoading
                            }
                            onClick={(
                              event,
                            ) => {
                              event.stopPropagation()

                              openBookingDetails(
                                booking.id,
                              )
                            }}
                          >
                            Details
                          </AdminButton>

                          {booking.status !==
                            "confirmed" && (
                            <AdminButton
                              variant="success"
                              disabled={
                                isActionLoading
                              }
                              onClick={(
                                event,
                              ) => {
                                event.stopPropagation()

                                void handleConfirm(
                                  booking.id,
                                )
                              }}
                            >
                              Confirm
                            </AdminButton>
                          )}

                          {booking.status !==
                            "cancelled" && (
                            <AdminButton
                              variant="danger"
                              disabled={
                                isActionLoading
                              }
                              onClick={(
                                event,
                              ) => {
                                event.stopPropagation()

                                void handleCancel(
                                  booking.id,
                                )
                              }}
                            >
                              Cancel
                            </AdminButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                },
              )}
            </tbody>
          </AdminTable>
        )}

        {filteredBookings.length > 0 && (
          <div className="booking-pagination">
            <AdminButton
              variant="secondary"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(
                  (currentValue) =>
                    Math.max(
                      1,
                      currentValue - 1,
                    ),
                )
              }}
            >
              Previous
            </AdminButton>

            <span>
              Page{" "}
              <strong>
                {currentPage}
              </strong>{" "}
              of{" "}
              <strong>
                {totalPages}
              </strong>
            </span>

            <AdminButton
              variant="secondary"
              disabled={
                currentPage ===
                totalPages
              }
              onClick={() => {
                setCurrentPage(
                  (currentValue) =>
                    Math.min(
                      totalPages,
                      currentValue + 1,
                    ),
                )
              }}
            >
              Next
            </AdminButton>
          </div>
        )}
      </section>

      <BookingDetailsDrawer
        booking={
          isEditBookingOpen
            ? null
            : selectedBooking
        }
        allBookings={bookings}
        actionBookingId={
          actionBookingId
        }
        onClose={closeBookingDetails}
        onEdit={openEditBooking}
        onConfirm={
          handleDrawerConfirm
        }
        onCancel={
          handleDrawerCancel
        }
      />

      <EditBookingDrawer
        booking={selectedBooking}
        isOpen={isEditBookingOpen}
        onClose={closeEditBooking}
        onSaved={refreshBookings}
      />
    </>
  )
}

export default BookingPage