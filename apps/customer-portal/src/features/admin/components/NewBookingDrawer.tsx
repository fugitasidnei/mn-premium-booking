import {
  useEffect,
  useMemo,
  useState,
} from "react"

import type {
  FormEvent,
} from "react"

import {
  createAdminBooking,
} from "../../../services/adminBookings"

import type {
  AdminBooking,
  BookingPlateType,
  BookingService,
  BookingStatus,
  CreateAdminBooking,
} from "../../../types/adminBooking"

import "./NewBookingDrawer.css"

interface NewBookingDrawerProps {
  isOpen: boolean
  initialDate: string
  initialTime: string
  bookings: AdminBooking[]
  onClose: () => void
  onSaved: () => Promise<void> | void
}

const scheduleTimes = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

function timeToMinutes(
  time: string,
): number {
  const [hours, minutes] = time
    .slice(0, 5)
    .split(":")
    .map(Number)

  return hours * 60 + minutes
}

function getServiceDuration(
  service: BookingService,
): number {
  return service === "premium"
    ? 150
    : 90
}

function getServicePrice(
  service: BookingService,
  plateType: BookingPlateType,
): number {
  if (
    service === "exterior" &&
    plateType === "yellow"
  ) {
    return 60
  }

  if (
    service === "exterior" &&
    plateType === "white"
  ) {
    return 80
  }

  if (
    service === "premium" &&
    plateType === "yellow"
  ) {
    return 140
  }

  return 180
}

function NewBookingDrawer({
  isOpen,
  initialDate,
  initialTime,
  bookings,
  onClose,
  onSaved,
}: NewBookingDrawerProps) {
  const [service, setService] =
    useState<BookingService>("exterior")

  const [plateType, setPlateType] =
    useState<BookingPlateType>("yellow")

  const [bookingDate, setBookingDate] =
    useState(initialDate)

  const [bookingTime, setBookingTime] =
    useState(initialTime)

  const [firstName, setFirstName] =
    useState("")

  const [lastName, setLastName] =
    useState("")

  const [phone, setPhone] =
    useState("")

  const [email, setEmail] =
    useState("")

  const [vehicle, setVehicle] =
    useState("")

  const [model, setModel] =
    useState("")

  const [licensePlate, setLicensePlate] =
    useState("")

  const [notes, setNotes] =
    useState("")

  const [status, setStatus] =
    useState<BookingStatus>("pending")

  const [isSaving, setIsSaving] =
    useState(false)

  const [error, setError] =
    useState("")

  const price = useMemo(() => {
    return getServicePrice(
      service,
      plateType,
    )
  }, [service, plateType])

  useEffect(() => {
    if (!isOpen) {
      return
    }

    setBookingDate(initialDate)
    setBookingTime(initialTime)
    setError("")
  }, [
    isOpen,
    initialDate,
    initialTime,
  ])

  function resetForm() {
    setService("exterior")
    setPlateType("yellow")
    setBookingDate(initialDate)
    setBookingTime(initialTime)
    setFirstName("")
    setLastName("")
    setPhone("")
    setEmail("")
    setVehicle("")
    setModel("")
    setLicensePlate("")
    setNotes("")
    setStatus("pending")
    setError("")
  }

  function handleClose() {
    if (isSaving) {
      return
    }

    resetForm()
    onClose()
  }

  function hasBookingConflict(): boolean {
    const newStart =
      timeToMinutes(bookingTime)

    const newEnd =
      newStart +
      getServiceDuration(service)

    return bookings.some(
      (booking) => {
        if (
          booking.booking_date !==
            bookingDate ||
          booking.status ===
            "cancelled"
        ) {
          return false
        }

        const existingStart =
          timeToMinutes(
            booking.booking_time,
          )

        const existingEnd =
          existingStart +
          getServiceDuration(
            booking.service,
          )

        return (
          newStart < existingEnd &&
          newEnd > existingStart
        )
      },
    )
  }

  function isOutsideBusinessHours(): boolean {
    const start =
      timeToMinutes(bookingTime)

    const end =
      start +
      getServiceDuration(service)

    const openingTime =
      timeToMinutes("10:00")

    const closingTime =
      timeToMinutes("18:00")

    return (
      start < openingTime ||
      end > closingTime
    )
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (
      !firstName.trim() ||
      !lastName.trim()
    ) {
      setError(
        "Enter the customer's first and last name.",
      )

      return
    }

    if (!phone.trim()) {
      setError(
        "Enter the customer's phone number.",
      )

      return
    }

    if (!vehicle.trim()) {
      setError(
        "Enter the customer's vehicle.",
      )

      return
    }

    if (isOutsideBusinessHours()) {
      setError(
        "This service does not fit within business hours.",
      )

      return
    }

    if (hasBookingConflict()) {
      setError(
        "This time conflicts with another booking.",
      )

      return
    }

    const newBooking: CreateAdminBooking = {
      service,
      plate_type: plateType,
      booking_date: bookingDate,
      booking_time: bookingTime,
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      vehicle: vehicle.trim(),
      model: model.trim(),
      license_plate:
        licensePlate.trim(),
      notes: notes.trim() || null,
      price,
      status,
    }

    try {
      setIsSaving(true)
      setError("")

      await createAdminBooking(
        newBooking,
      )

      await onSaved()

      resetForm()
    } catch (saveError) {
      const message =
        saveError instanceof Error
          ? saveError.message
          : "Could not create the booking."

      setError(message)
    } finally {
      setIsSaving(false)
    }
  }

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="new-booking-drawer__overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          handleClose()
        }
      }}
    >
      <aside
        className="new-booking-drawer"
        aria-label="Create new booking"
      >
        <header className="new-booking-drawer__header">
          <div>
            <span>
              NEW APPOINTMENT
            </span>

            <h2>Create booking</h2>

            <p>
              Add a customer directly
              to the schedule.
            </p>
          </div>

          <button
            type="button"
            aria-label="Close drawer"
            disabled={isSaving}
            onClick={handleClose}
          >
            ×
          </button>
        </header>

        <form
          className="new-booking-drawer__form"
          onSubmit={handleSubmit}
        >
          {error && (
            <div className="new-booking-drawer__error">
              {error}
            </div>
          )}

          <div className="new-booking-drawer__grid">
            <label>
              Service

              <select
                value={service}
                onChange={(event) => {
                  setService(
                    event.target
                      .value as BookingService,
                  )
                }}
              >
                <option value="exterior">
                  Exterior Wash
                </option>

                <option value="premium">
                  Premium Finish
                </option>
              </select>
            </label>

            <label>
              Plate type

              <select
                value={plateType}
                onChange={(event) => {
                  setPlateType(
                    event.target
                      .value as BookingPlateType,
                  )
                }}
              >
                <option value="yellow">
                  Yellow plate
                </option>

                <option value="white">
                  White plate
                </option>
              </select>
            </label>

            <label>
              Date

              <input
                type="date"
                required
                value={bookingDate}
                onChange={(event) => {
                  setBookingDate(
                    event.target.value,
                  )
                }}
              />
            </label>

            <label>
              Start time

              <select
                value={bookingTime}
                onChange={(event) => {
                  setBookingTime(
                    event.target.value,
                  )
                }}
              >
                {scheduleTimes.map(
                  (time) => (
                    <option
                      key={time}
                      value={time}
                    >
                      {time}
                    </option>
                  ),
                )}
              </select>
            </label>

            <label>
              First name

              <input
                type="text"
                required
                value={firstName}
                onChange={(event) => {
                  setFirstName(
                    event.target.value,
                  )
                }}
              />
            </label>

            <label>
              Last name

              <input
                type="text"
                required
                value={lastName}
                onChange={(event) => {
                  setLastName(
                    event.target.value,
                  )
                }}
              />
            </label>

            <label>
              Phone

              <input
                type="tel"
                required
                value={phone}
                onChange={(event) => {
                  setPhone(
                    event.target.value,
                  )
                }}
              />
            </label>

            <label>
              Email

              <input
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(
                    event.target.value,
                  )
                }}
              />
            </label>

            <label>
              Vehicle

              <input
                type="text"
                required
                placeholder="Example: Toyota"
                value={vehicle}
                onChange={(event) => {
                  setVehicle(
                    event.target.value,
                  )
                }}
              />
            </label>

            <label>
              Model

              <input
                type="text"
                placeholder="Example: Alphard"
                value={model}
                onChange={(event) => {
                  setModel(
                    event.target.value,
                  )
                }}
              />
            </label>

            <label>
              License plate

              <input
                type="text"
                value={licensePlate}
                onChange={(event) => {
                  setLicensePlate(
                    event.target.value,
                  )
                }}
              />
            </label>

            <label>
              Status

              <select
                value={status}
                onChange={(event) => {
                  setStatus(
                    event.target
                      .value as BookingStatus,
                  )
                }}
              >
                <option value="pending">
                  Pending
                </option>

                <option value="confirmed">
                  Confirmed
                </option>
              </select>
            </label>
          </div>

          <label className="new-booking-drawer__notes">
            Notes

            <textarea
              rows={4}
              value={notes}
              onChange={(event) => {
                setNotes(
                  event.target.value,
                )
              }}
            />
          </label>

          <div className="new-booking-drawer__price">
            <span>
              Booking price
            </span>

            <strong>
              ${price}
            </strong>
          </div>

          <footer className="new-booking-drawer__actions">
            <button
              type="button"
              disabled={isSaving}
              onClick={handleClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSaving}
            >
              {isSaving
                ? "Creating..."
                : "Create booking"}
            </button>
          </footer>
        </form>
      </aside>
    </div>
  )
}

export default NewBookingDrawer