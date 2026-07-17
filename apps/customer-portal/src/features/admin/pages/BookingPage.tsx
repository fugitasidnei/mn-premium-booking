import {
  useEffect,
  useMemo,
  useState,
} from "react"

import EditBookingDrawer from "../components/EditBookingDrawer"

import {
  AdminBadge,
  AdminButton,
  AdminCard,
  AdminInput,
  AdminSelect,
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

type SortKey =
  | "customer"
  | "date"
  | "time"
  | "service"
  | "vehicle"
  | "plate"
  | "price"
  | "status"

type SortDirection =
  | "ascending"
  | "descending"

function formatBookingDate(
  date: string,
): string {
  const [year, month, day] =
    date.split("-")

  if (!year || !month || !day) {
    return date
  }

  return `${month}/${day}/${year}`
}

function formatBookingTime(
  time: string,
): string {
  return time.slice(0, 5)
}

function getCustomerName(
  booking: AdminBooking,
): string {
  return `${booking.first_name} ${booking.last_name}`.trim()
}

function getServiceName(
  service: BookingService,
): string {
  if (service === "premium") {
    return "Premium Finish"
  }

  return "Exterior Wash"
}

function getPlateName(
  plateType: AdminBooking["plate_type"],
): string {
  if (plateType === "yellow") {
    return "Yellow Plate"
  }

  return "White Plate"
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

function getSortValue(
  booking: AdminBooking,
  sortKey: SortKey,
): string | number {
  switch (sortKey) {
    case "customer":
      return getCustomerName(
        booking,
      ).toLowerCase()

    case "date":
      return `${booking.booking_date} ${booking.booking_time}`

    case "time":
      return booking.booking_time

    case "service":
      return getServiceName(
        booking.service,
      ).toLowerCase()

    case "vehicle":
      return `${booking.vehicle} ${booking.model}`.toLowerCase()

    case "plate":
      return booking.license_plate.toLowerCase()

    case "price":
      return Number(booking.price)

    case "status":
      return booking.status

    default:
      return ""
  }
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

  const [searchTerm, setSearchTerm] =
    useState("")

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all")

  const [serviceFilter, setServiceFilter] =
    useState<ServiceFilter>("all")

  const [dateFilter, setDateFilter] =
    useState("")

  const [sortKey, setSortKey] =
    useState<SortKey>("date")

  const [
    sortDirection,
    setSortDirection,
  ] = useState<SortDirection>(
    "ascending",
  )

  const [currentPage, setCurrentPage] =
    useState(1)

  const [pageSize, setPageSize] =
    useState(10)

  const [
    selectedBooking,
    setSelectedBooking,
  ] = useState<AdminBooking | null>(null)

  const [
    isEditDrawerOpen,
    setIsEditDrawerOpen,
  ] = useState(false)

  const filteredBookings = useMemo(() => {
    const normalizedSearch =
      searchTerm.trim().toLowerCase()

    return bookings.filter((booking) => {
      const matchesStatus =
        statusFilter === "all" ||
        booking.status === statusFilter

      const matchesService =
        serviceFilter === "all" ||
        booking.service === serviceFilter

      const matchesDate =
        !dateFilter ||
        booking.booking_date === dateFilter

      if (
        !matchesStatus ||
        !matchesService ||
        !matchesDate
      ) {
        return false
      }

      if (!normalizedSearch) {
        return true
      }

      const searchableContent = [
        booking.first_name,
        booking.last_name,
        booking.phone,
        booking.email,
        booking.vehicle,
        booking.model,
        booking.license_plate,
        booking.service,
        booking.status,
        booking.booking_date,
        booking.booking_time,
      ]
        .join(" ")
        .toLowerCase()

      return searchableContent.includes(
        normalizedSearch,
      )
    })
  }, [
    bookings,
    searchTerm,
    statusFilter,
    serviceFilter,
    dateFilter,
  ])

  const sortedBookings = useMemo(() => {
    return [...filteredBookings].sort(
      (firstBooking, secondBooking) => {
        const firstValue = getSortValue(
          firstBooking,
          sortKey,
        )

        const secondValue = getSortValue(
          secondBooking,
          sortKey,
        )

        let comparison = 0

        if (
          typeof firstValue === "number" &&
          typeof secondValue === "number"
        ) {
          comparison =
            firstValue - secondValue
        } else {
          comparison = String(
            firstValue,
          ).localeCompare(
            String(secondValue),
            undefined,
            {
              numeric: true,
              sensitivity: "base",
            },
          )
        }

        return sortDirection === "ascending"
          ? comparison
          : comparison * -1
      },
    )
  }, [
    filteredBookings,
    sortKey,
    sortDirection,
  ])

  const totalPages = Math.max(
    1,
    Math.ceil(
      sortedBookings.length / pageSize,
    ),
  )

  const paginatedBookings = useMemo(() => {
    const startIndex =
      (currentPage - 1) * pageSize

    return sortedBookings.slice(
      startIndex,
      startIndex + pageSize,
    )
  }, [
    sortedBookings,
    currentPage,
    pageSize,
  ])

  const firstVisibleBooking =
    sortedBookings.length === 0
      ? 0
      : (currentPage - 1) * pageSize + 1

  const lastVisibleBooking = Math.min(
    currentPage * pageSize,
    sortedBookings.length,
  )

  const pendingCount = bookings.filter(
    (booking) =>
      booking.status === "pending",
  ).length

  const confirmedCount = bookings.filter(
    (booking) =>
      booking.status === "confirmed",
  ).length

  const cancelledCount = bookings.filter(
    (booking) =>
      booking.status === "cancelled",
  ).length

  useEffect(() => {
    setCurrentPage(1)
  }, [
    searchTerm,
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

  function handleSort(
    selectedSortKey: SortKey,
  ) {
    if (sortKey === selectedSortKey) {
      setSortDirection(
        (
          currentDirection,
        ) =>
          currentDirection === "ascending"
            ? "descending"
            : "ascending",
      )

      return
    }

    setSortKey(selectedSortKey)
    setSortDirection("ascending")
  }

  function getSortSymbol(
    selectedSortKey: SortKey,
  ): string {
    if (sortKey !== selectedSortKey) {
      return "↕"
    }

    return sortDirection === "ascending"
      ? "↑"
      : "↓"
  }

  function openEditDrawer(
    booking: AdminBooking,
  ) {
    setSelectedBooking(booking)
    setIsEditDrawerOpen(true)
  }

  function closeEditDrawer() {
    setIsEditDrawerOpen(false)
    setSelectedBooking(null)
  }

  function clearFilters() {
    setSearchTerm("")
    setStatusFilter("all")
    setServiceFilter("all")
    setDateFilter("")
    setCurrentPage(1)
  }

  async function handleCancel(
    bookingId: string,
  ): Promise<void> {
    const shouldCancel = window.confirm(
      "Are you sure you want to cancel this booking?",
    )

    if (!shouldCancel) {
      return
    }

    await cancelBooking(bookingId)
  }

  return (
    <>
      <section className="booking-manager">
        <header className="booking-manager__header">
          <div>
            <h1>Bookings</h1>

            <p>
              Manage all customer appointments.
            </p>
          </div>

          <AdminButton
            variant="primary"
            disabled={isLoading}
            onClick={() => {
              void refreshBookings()
            }}
          >
            Refresh
          </AdminButton>
        </header>

        <div className="booking-manager__summary">
          <AdminCard className="booking-summary-card">
            <span>Total Bookings</span>
            <strong>{bookings.length}</strong>
          </AdminCard>

          <AdminCard className="booking-summary-card">
            <span>Pending</span>
            <strong>{pendingCount}</strong>
          </AdminCard>

          <AdminCard className="booking-summary-card">
            <span>Confirmed</span>
            <strong>{confirmedCount}</strong>
          </AdminCard>

          <AdminCard className="booking-summary-card">
            <span>Cancelled</span>
            <strong>{cancelledCount}</strong>
          </AdminCard>
        </div>

        <AdminCard className="booking-manager__filters-card">
          <div className="booking-manager__filters">
            <AdminInput
              type="search"
              label="Search"
              placeholder="Customer, vehicle, phone or plate..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(
                  event.target.value,
                )
              }}
            />

            <AdminSelect
              label="Status"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(
                  event.target
                    .value as StatusFilter,
                )
              }}
            >
              <option value="all">
                All Statuses
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
            </AdminSelect>

            <AdminSelect
              label="Service"
              value={serviceFilter}
              onChange={(event) => {
                setServiceFilter(
                  event.target
                    .value as ServiceFilter,
                )
              }}
            >
              <option value="all">
                All Services
              </option>

              <option value="exterior">
                Exterior Wash
              </option>

              <option value="premium">
                Premium Finish
              </option>
            </AdminSelect>

            <AdminInput
              type="date"
              label="Booking Date"
              value={dateFilter}
              onChange={(event) => {
                setDateFilter(
                  event.target.value,
                )
              }}
            />

            <div className="booking-manager__clear-filter">
              <AdminButton
                variant="secondary"
                fullWidth
                onClick={clearFilters}
              >
                Clear Filters
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
          <span>
            Showing{" "}
            <strong>
              {firstVisibleBooking}
            </strong>
            {" - "}
            <strong>
              {lastVisibleBooking}
            </strong>
            {" of "}
            <strong>
              {sortedBookings.length}
            </strong>
            {" filtered bookings"}
          </span>

          <div className="booking-manager__page-size">
            <label htmlFor="booking-page-size">
              Rows per page
            </label>

            <select
              id="booking-page-size"
              className="booking-manager__page-size-select"
              value={pageSize}
              onChange={(event) => {
                setPageSize(
                  Number(event.target.value),
                )
              }}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="booking-manager__message">
            Loading bookings...
          </div>
        ) : sortedBookings.length === 0 ? (
          <div className="booking-manager__message">
            No bookings found.
          </div>
        ) : (
          <AdminTable minWidth={1180}>
            <thead>
              <tr>
                <th>
                  <button
                    type="button"
                    className="booking-sort-button"
                    onClick={() => {
                      handleSort("customer")
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

                <th>
                  <button
                    type="button"
                    className="booking-sort-button"
                    onClick={() => {
                      handleSort("date")
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
                    type="button"
                    className="booking-sort-button"
                    onClick={() => {
                      handleSort("time")
                    }}
                  >
                    Time
                    <span>
                      {getSortSymbol("time")}
                    </span>
                  </button>
                </th>

                <th>
                  <button
                    type="button"
                    className="booking-sort-button"
                    onClick={() => {
                      handleSort("service")
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

                <th>
                  <button
                    type="button"
                    className="booking-sort-button"
                    onClick={() => {
                      handleSort("vehicle")
                    }}
                  >
                    Vehicle
                    <span>
                      {getSortSymbol(
                        "vehicle",
                      )}
                    </span>
                  </button>
                </th>

                <th>
                  <button
                    type="button"
                    className="booking-sort-button"
                    onClick={() => {
                      handleSort("plate")
                    }}
                  >
                    Plate
                    <span>
                      {getSortSymbol("plate")}
                    </span>
                  </button>
                </th>

                <th>
                  <button
                    type="button"
                    className="booking-sort-button"
                    onClick={() => {
                      handleSort("price")
                    }}
                  >
                    Price
                    <span>
                      {getSortSymbol("price")}
                    </span>
                  </button>
                </th>

                <th>
                  <button
                    type="button"
                    className="booking-sort-button"
                    onClick={() => {
                      handleSort("status")
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
                  const isUpdating =
                    actionBookingId ===
                    booking.id

                  return (
                    <tr key={booking.id}>
                      <td>
                        <div className="booking-table-cell">
                          <strong>
                            {getCustomerName(
                              booking,
                            )}
                          </strong>

                          <small>
                            {booking.phone}
                          </small>

                          <small>
                            {booking.email}
                          </small>
                        </div>
                      </td>

                      <td>
                        {formatBookingDate(
                          booking.booking_date,
                        )}
                      </td>

                      <td>
                        {formatBookingTime(
                          booking.booking_time,
                        )}
                      </td>

                      <td>
                        <div className="booking-table-cell">
                          <strong>
                            {getServiceName(
                              booking.service,
                            )}
                          </strong>

                          <small>
                            {getPlateName(
                              booking.plate_type,
                            )}
                          </small>
                        </div>
                      </td>

                      <td>
                        <div className="booking-table-cell">
                          <strong>
                            {booking.vehicle}
                          </strong>

                          <small>
                            {booking.model ||
                              "No model"}
                          </small>
                        </div>
                      </td>

                      <td>
                        {booking.license_plate ||
                          "—"}
                      </td>

                      <td>
                        <strong>
                          $
                          {Number(
                            booking.price,
                          ).toFixed(2)}
                        </strong>
                      </td>

                      <td>
                        <AdminBadge
                          variant={
                            booking.status
                          }
                        >
                          {getStatusName(
                            booking.status,
                          )}
                        </AdminBadge>
                      </td>

                      <td>
                        <div className="booking-manager__actions">
                          <AdminButton
                            variant="secondary"
                            disabled={isUpdating}
                            onClick={() => {
                              openEditDrawer(
                                booking,
                              )
                            }}
                          >
                            Edit
                          </AdminButton>

                          {booking.status !==
                            "confirmed" && (
                            <AdminButton
                              variant="success"
                              disabled={isUpdating}
                              onClick={() => {
                                void confirmBooking(
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
                              disabled={isUpdating}
                              onClick={() => {
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

        {sortedBookings.length > 0 && (
          <div className="booking-pagination">
            <AdminButton
              variant="secondary"
              disabled={currentPage === 1}
              onClick={() => {
                setCurrentPage(
                  (page) =>
                    Math.max(1, page - 1),
                )
              }}
            >
              Previous
            </AdminButton>

            <span>
              Page{" "}
              <strong>{currentPage}</strong>
              {" of "}
              <strong>{totalPages}</strong>
            </span>

            <AdminButton
              variant="secondary"
              disabled={
                currentPage === totalPages
              }
              onClick={() => {
                setCurrentPage(
                  (page) =>
                    Math.min(
                      totalPages,
                      page + 1,
                    ),
                )
              }}
            >
              Next
            </AdminButton>
          </div>
        )}
      </section>

      <EditBookingDrawer
        booking={selectedBooking}
        isOpen={isEditDrawerOpen}
        onClose={closeEditDrawer}
        onSaved={refreshBookings}
      />
    </>
  )
}

export default BookingPage