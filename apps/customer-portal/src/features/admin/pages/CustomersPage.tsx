import {
  useMemo,
  useState,
} from "react"

import CustomerDetailsDrawer from "../components/CustomerDetailsDrawer"

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
} from "../../../types/adminBooking"

import type {
  AdminCustomer,
  CustomerLevel,
} from "../types/adminCustomer"

import "./CustomersPage.css"

type CustomerStatusFilter =
  | "all"
  | "active"
  | "inactive"

type CustomerLevelFilter =
  | "all"
  | CustomerLevel

function getCustomerKey(
  booking: AdminBooking,
): string {
  const normalizedEmail =
    booking.email.trim().toLowerCase()

  if (normalizedEmail) {
    return `email:${normalizedEmail}`
  }

  const normalizedPhone =
    booking.phone.replace(/\D/g, "")

  if (normalizedPhone) {
    return `phone:${normalizedPhone}`
  }

  return [
    booking.first_name,
    booking.last_name,
  ]
    .join(":")
    .trim()
    .toLowerCase()
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

function getToday(): string {
  const today = new Date()

  const year = today.getFullYear()

  const month = String(
    today.getMonth() + 1,
  ).padStart(2, "0")

  const day = String(
    today.getDate(),
  ).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function getCustomerLevel(
  bookingsCount: number,
  totalSpent: number,
): CustomerLevel {
  if (
    bookingsCount >= 6 ||
    totalSpent >= 600
  ) {
    return "vip"
  }

  if (bookingsCount >= 2) {
    return "returning"
  }

  return "standard"
}

function getCustomerLevelName(
  level: CustomerLevel,
): string {
  if (level === "vip") {
    return "VIP"
  }

  if (level === "returning") {
    return "Returning"
  }

  return "Standard"
}

function CustomersPage() {
  const {
    bookings,
    isLoading,
    error,
    refreshBookings,
  } = useAdminBookings()

  const [searchTerm, setSearchTerm] =
    useState("")

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<CustomerStatusFilter>(
    "all",
  )

  const [
    levelFilter,
    setLevelFilter,
  ] = useState<CustomerLevelFilter>(
    "all",
  )

  const [
    selectedCustomer,
    setSelectedCustomer,
  ] = useState<AdminCustomer | null>(null)

  const [
    isDetailsDrawerOpen,
    setIsDetailsDrawerOpen,
  ] = useState(false)

  const customers = useMemo(() => {
    const customersMap =
      new Map<string, AdminCustomer>()

    const today = getToday()

    bookings.forEach((booking) => {
      const customerKey =
        getCustomerKey(booking)

      const existingCustomer =
        customersMap.get(customerKey)

      const vehicleDescription = [
        booking.vehicle,
        booking.model,
      ]
        .filter(Boolean)
        .join(" ")
        .trim()

      const bookingPrice =
        booking.status === "cancelled"
          ? 0
          : Number(booking.price) || 0

      const isFutureBooking =
        booking.booking_date >= today &&
        booking.status !== "cancelled"

      const isPastOrTodayBooking =
        booking.booking_date <= today &&
        booking.status === "confirmed"

      if (!existingCustomer) {
        const initialBookingsCount = 1

        const initialTotalSpent =
          bookingPrice

        customersMap.set(customerKey, {
          id: customerKey,
          firstName:
            booking.first_name,
          lastName:
            booking.last_name,
          phone: booking.phone,
          email: booking.email,
          vehicles: vehicleDescription
            ? [vehicleDescription]
            : [],
          licensePlates:
            booking.license_plate
              ? [booking.license_plate]
              : [],
          bookingsCount:
            initialBookingsCount,
          confirmedBookingsCount:
            booking.status ===
            "confirmed"
              ? 1
              : 0,
          cancelledBookingsCount:
            booking.status ===
            "cancelled"
              ? 1
              : 0,
          totalSpent:
            initialTotalSpent,
          averageTicket:
            initialTotalSpent,
          lastVisitDate:
            isPastOrTodayBooking
              ? booking.booking_date
              : null,
          nextBookingDate:
            isFutureBooking
              ? booking.booking_date
              : null,
          customerSince:
            booking.booking_date,
          status:
            booking.status ===
            "cancelled"
              ? "inactive"
              : "active",
          level: getCustomerLevel(
            initialBookingsCount,
            initialTotalSpent,
          ),
          bookings: [booking],
        })

        return
      }

      existingCustomer.bookings.push(
        booking,
      )

      existingCustomer.bookingsCount += 1

      if (
        booking.status === "confirmed"
      ) {
        existingCustomer
          .confirmedBookingsCount += 1
      }

      if (
        booking.status === "cancelled"
      ) {
        existingCustomer
          .cancelledBookingsCount += 1
      }

      existingCustomer.totalSpent +=
        bookingPrice

      if (
        isPastOrTodayBooking &&
        (
          !existingCustomer
            .lastVisitDate ||
          booking.booking_date >
            existingCustomer
              .lastVisitDate
        )
      ) {
        existingCustomer.lastVisitDate =
          booking.booking_date
      }

      if (
        isFutureBooking &&
        (
          !existingCustomer
            .nextBookingDate ||
          booking.booking_date <
            existingCustomer
              .nextBookingDate
        )
      ) {
        existingCustomer.nextBookingDate =
          booking.booking_date
      }

      if (
        booking.booking_date <
        existingCustomer.customerSince
      ) {
        existingCustomer.customerSince =
          booking.booking_date
      }

      if (
        booking.status !== "cancelled"
      ) {
        existingCustomer.status =
          "active"
      }

      if (
        vehicleDescription &&
        !existingCustomer.vehicles.includes(
          vehicleDescription,
        )
      ) {
        existingCustomer.vehicles.push(
          vehicleDescription,
        )
      }

      if (
        booking.license_plate &&
        !existingCustomer
          .licensePlates.includes(
            booking.license_plate,
          )
      ) {
        existingCustomer
          .licensePlates.push(
            booking.license_plate,
          )
      }

      existingCustomer.averageTicket =
        existingCustomer
          .confirmedBookingsCount > 0
          ? existingCustomer.totalSpent /
            existingCustomer
              .confirmedBookingsCount
          : 0

      existingCustomer.level =
        getCustomerLevel(
          existingCustomer.bookingsCount,
          existingCustomer.totalSpent,
        )
    })

    return Array.from(
      customersMap.values(),
    ).sort(
      (
        firstCustomer,
        secondCustomer,
      ) =>
        getCustomerName(firstCustomer)
          .localeCompare(
            getCustomerName(
              secondCustomer,
            ),
            undefined,
            {
              sensitivity: "base",
            },
          ),
    )
  }, [bookings])

  const filteredCustomers =
    useMemo(() => {
      const normalizedSearch =
        searchTerm.trim().toLowerCase()

      return customers.filter(
        (customer) => {
          const matchesStatus =
            statusFilter === "all" ||
            customer.status ===
              statusFilter

          const matchesLevel =
            levelFilter === "all" ||
            customer.level ===
              levelFilter

          if (
            !matchesStatus ||
            !matchesLevel
          ) {
            return false
          }

          if (!normalizedSearch) {
            return true
          }

          const searchableContent = [
            customer.firstName,
            customer.lastName,
            customer.phone,
            customer.email,
            customer.level,
            ...customer.vehicles,
            ...customer.licensePlates,
          ]
            .join(" ")
            .toLowerCase()

          return searchableContent.includes(
            normalizedSearch,
          )
        },
      )
    }, [
      customers,
      searchTerm,
      statusFilter,
      levelFilter,
    ])

  const activeCustomersCount =
    customers.filter(
      (customer) =>
        customer.status === "active",
    ).length

  const vipCustomersCount =
    customers.filter(
      (customer) =>
        customer.level === "vip",
    ).length

  const totalRevenue =
    customers.reduce(
      (total, customer) =>
        total + customer.totalSpent,
      0,
    )

  function clearFilters() {
    setSearchTerm("")
    setStatusFilter("all")
    setLevelFilter("all")
  }

  function openCustomerDetails(
    customer: AdminCustomer,
  ) {
    setSelectedCustomer(customer)
    setIsDetailsDrawerOpen(true)
  }

  function closeCustomerDetails() {
    setIsDetailsDrawerOpen(false)
    setSelectedCustomer(null)
  }

  return (
    <>
      <section className="customers-manager">
        <header className="customers-manager__header">
          <div>
            <h1>Customers</h1>

            <p>
              View customers and their
              complete booking history.
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

        <div className="customers-manager__summary">
          <AdminCard className="customer-summary-card">
            <span>Total Customers</span>

            <strong>
              {customers.length}
            </strong>
          </AdminCard>

          <AdminCard className="customer-summary-card">
            <span>Active Customers</span>

            <strong>
              {activeCustomersCount}
            </strong>
          </AdminCard>

          <AdminCard className="customer-summary-card">
            <span>VIP Customers</span>

            <strong>
              {vipCustomersCount}
            </strong>
          </AdminCard>

          <AdminCard className="customer-summary-card">
            <span>Total Revenue</span>

            <strong>
              {formatCurrency(
                totalRevenue,
              )}
            </strong>
          </AdminCard>
        </div>

        <AdminCard className="customers-manager__filters-card">
          <div className="customers-manager__filters">
            <AdminInput
              type="search"
              label="Search"
              placeholder="Name, phone, email, vehicle or plate..."
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(
                  event.target.value,
                )
              }}
            />

            <AdminSelect
              label="Customer Status"
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(
                  event.target
                    .value as CustomerStatusFilter,
                )
              }}
            >
              <option value="all">
                All Statuses
              </option>

              <option value="active">
                Active
              </option>

              <option value="inactive">
                Inactive
              </option>
            </AdminSelect>

            <AdminSelect
              label="Customer Level"
              value={levelFilter}
              onChange={(event) => {
                setLevelFilter(
                  event.target
                    .value as CustomerLevelFilter,
                )
              }}
            >
              <option value="all">
                All Levels
              </option>

              <option value="standard">
                Standard
              </option>

              <option value="returning">
                Returning
              </option>

              <option value="vip">
                VIP
              </option>
            </AdminSelect>

            <div className="customers-manager__clear-filter">
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
          <div className="customers-manager__error">
            {error}
          </div>
        )}

        <div className="customers-manager__results">
          Showing{" "}
          <strong>
            {filteredCustomers.length}
          </strong>{" "}
          of{" "}
          <strong>
            {customers.length}
          </strong>{" "}
          customers
        </div>

        {isLoading ? (
          <div className="customers-manager__message">
            Loading customers...
          </div>
        ) : filteredCustomers.length ===
          0 ? (
          <div className="customers-manager__message">
            No customers found.
          </div>
        ) : (
          <AdminTable minWidth={1220}>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Vehicles</th>
                <th>Bookings</th>
                <th>Confirmed</th>
                <th>Cancelled</th>
                <th>Total Spent</th>
                <th>Last Visit</th>
                <th>Next Booking</th>
                <th>Level</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {filteredCustomers.map(
                (customer) => (
                  <tr
                    key={customer.id}
                    className="customer-table-row"
                    tabIndex={0}
                    onClick={() => {
                      openCustomerDetails(
                        customer,
                      )
                    }}
                    onKeyDown={(event) => {
                      if (
                        event.key ===
                          "Enter" ||
                        event.key === " "
                      ) {
                        event.preventDefault()

                        openCustomerDetails(
                          customer,
                        )
                      }
                    }}
                  >
                    <td>
                      <div className="customer-table-cell">
                        <strong>
                          {getCustomerName(
                            customer,
                          )}
                        </strong>

                        <small>
                          {customer.email ||
                            "No email"}
                        </small>
                      </div>
                    </td>

                    <td>
                      <div className="customer-table-cell">
                        <span>
                          {customer.phone ||
                            "No phone"}
                        </span>

                        <small>
                          {customer
                            .licensePlates
                            .join(", ") ||
                            "No plate"}
                        </small>
                      </div>
                    </td>

                    <td>
                      <div className="customer-table-cell">
                        {customer.vehicles
                          .slice(0, 2)
                          .map((vehicle) => (
                            <small
                              key={vehicle}
                            >
                              {vehicle}
                            </small>
                          ))}

                        {customer.vehicles
                          .length > 2 && (
                          <small>
                            +
                            {customer
                              .vehicles
                              .length -
                              2}{" "}
                            more
                          </small>
                        )}
                      </div>
                    </td>

                    <td>
                      <strong>
                        {
                          customer.bookingsCount
                        }
                      </strong>
                    </td>

                    <td>
                      {
                        customer
                          .confirmedBookingsCount
                      }
                    </td>

                    <td>
                      {
                        customer
                          .cancelledBookingsCount
                      }
                    </td>

                    <td>
                      <strong>
                        {formatCurrency(
                          customer.totalSpent,
                        )}
                      </strong>
                    </td>

                    <td>
                      {formatDate(
                        customer.lastVisitDate,
                      )}
                    </td>

                    <td>
                      {formatDate(
                        customer.nextBookingDate,
                      )}
                    </td>

                    <td>
                      <span
                        className={`customer-level-badge customer-level-badge--${customer.level}`}
                      >
                        {getCustomerLevelName(
                          customer.level,
                        )}
                      </span>
                    </td>

                    <td>
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
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </AdminTable>
        )}
      </section>

      <CustomerDetailsDrawer
        customer={selectedCustomer}
        isOpen={isDetailsDrawerOpen}
        onClose={closeCustomerDetails}
      />
    </>
  )
}

export default CustomersPage