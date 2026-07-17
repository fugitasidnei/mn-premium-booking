import {
  useMemo,
  useState,
} from "react"

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

import "./CustomersPage.css"

type CustomerStatusFilter =
  | "all"
  | "active"
  | "inactive"

interface AdminCustomer {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  vehicles: string[]
  licensePlates: string[]
  bookingsCount: number
  completedBookingsCount: number
  cancelledBookingsCount: number
  totalSpent: number
  lastBookingDate: string
  nextBookingDate: string | null
  status: "active" | "inactive"
  bookings: AdminBooking[]
}

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

function getToday(): string {
  return new Date()
    .toISOString()
    .slice(0, 10)
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
  ] = useState<CustomerStatusFilter>("all")

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
          : Number(booking.price)

      const isFutureBooking =
        booking.booking_date >= today &&
        booking.status !== "cancelled"

      if (!existingCustomer) {
        customersMap.set(customerKey, {
          id: customerKey,
          firstName: booking.first_name,
          lastName: booking.last_name,
          phone: booking.phone,
          email: booking.email,
          vehicles: vehicleDescription
            ? [vehicleDescription]
            : [],
          licensePlates:
            booking.license_plate
              ? [booking.license_plate]
              : [],
          bookingsCount: 1,
          completedBookingsCount:
            booking.status === "confirmed"
              ? 1
              : 0,
          cancelledBookingsCount:
            booking.status === "cancelled"
              ? 1
              : 0,
          totalSpent: bookingPrice,
          lastBookingDate:
            booking.booking_date,
          nextBookingDate:
            isFutureBooking
              ? booking.booking_date
              : null,
          status:
            booking.status === "cancelled"
              ? "inactive"
              : "active",
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
          .completedBookingsCount += 1
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
        booking.booking_date >
        existingCustomer.lastBookingDate
      ) {
        existingCustomer.lastBookingDate =
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
        booking.status !== "cancelled"
      ) {
        existingCustomer.status = "active"
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
    })

    return Array.from(
      customersMap.values(),
    ).sort((firstCustomer, secondCustomer) =>
      getCustomerName(firstCustomer)
        .localeCompare(
          getCustomerName(secondCustomer),
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

          if (!matchesStatus) {
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
    ])

  const activeCustomersCount =
    customers.filter(
      (customer) =>
        customer.status === "active",
    ).length

  const totalRevenue =
    customers.reduce(
      (total, customer) =>
        total + customer.totalSpent,
      0,
    )

  const returningCustomersCount =
    customers.filter(
      (customer) =>
        customer.bookingsCount > 1,
    ).length

  function clearFilters() {
    setSearchTerm("")
    setStatusFilter("all")
  }

  return (
    <section className="customers-manager">
      <header className="customers-manager__header">
        <div>
          <h1>Customers</h1>

          <p>
            View customers and their booking
            history.
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
          <span>Returning Customers</span>
          <strong>
            {returningCustomersCount}
          </strong>
        </AdminCard>

        <AdminCard className="customer-summary-card">
          <span>Total Revenue</span>
          <strong>
            ${totalRevenue.toFixed(2)}
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
              All Customers
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
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
      ) : filteredCustomers.length === 0 ? (
        <div className="customers-manager__message">
          No customers found.
        </div>
      ) : (
        <AdminTable minWidth={1180}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Contact</th>
              <th>Vehicles</th>
              <th>Bookings</th>
              <th>Confirmed</th>
              <th>Cancelled</th>
              <th>Total Spent</th>
              <th>Last Booking</th>
              <th>Next Booking</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredCustomers.map(
              (customer) => (
                <tr key={customer.id}>
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
                          .join(", ") || "No plate"}
                      </small>
                    </div>
                  </td>

                  <td>
                    <div className="customer-table-cell">
                      {customer.vehicles
                        .slice(0, 2)
                        .map((vehicle) => (
                          <small key={vehicle}>
                            {vehicle}
                          </small>
                        ))}

                      {customer.vehicles
                        .length > 2 && (
                        <small>
                          +
                          {customer.vehicles
                            .length - 2}{" "}
                          more
                        </small>
                      )}
                    </div>
                  </td>

                  <td>
                    <strong>
                      {customer.bookingsCount}
                    </strong>
                  </td>

                  <td>
                    {
                      customer
                        .completedBookingsCount
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
                      $
                      {customer.totalSpent.toFixed(
                        2,
                      )}
                    </strong>
                  </td>

                  <td>
                    {formatDate(
                      customer.lastBookingDate,
                    )}
                  </td>

                  <td>
                    {formatDate(
                      customer.nextBookingDate,
                    )}
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
  )
}

export default CustomersPage