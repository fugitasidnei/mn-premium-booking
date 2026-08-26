import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"

import "./Booking.css"

import {
  createBooking,
  getBookedTimes,
} from "../services/bookings"

import { supabase } from "../services/supabase"

type ServiceType = "exterior" | "premium"
type PlateType = "yellow" | "white"

const SERVICES = {
  exterior: {
    name: "Exterior Wash",
    duration: 90,
    prices: {
      yellow: 60,
      white: 80,
    },
  },

  premium: {
    name: "Premium Finish",
    duration: 150,
    prices: {
      yellow: 140,
      white: 180,
    },
  },
}

const AVAILABLE_TIMES = [
  "10:00",
  "11:30",
  "13:30",
  "15:00",
  "16:30",
]

function Booking() {
  const submissionLock = useRef(false)

  const [service, setService] =
    useState<ServiceType>("exterior")

  const [plateType, setPlateType] =
    useState<PlateType>("yellow")

  const [date, setDate] = useState("")
  const [time, setTime] = useState("")

  const [firstName, setFirstName] =
    useState("")

  const [lastName, setLastName] =
    useState("")

  const [phone, setPhone] = useState("")
  const [email, setEmail] = useState("")
  const [vehicle, setVehicle] = useState("")
  const [model, setModel] = useState("")

  const [licensePlate, setLicensePlate] =
    useState("")

  const [notes, setNotes] = useState("")

  const [bookedTimes, setBookedTimes] =
    useState<string[]>([])

  const [loadingTimes, setLoadingTimes] =
    useState(false)

  const [savingBooking, setSavingBooking] =
    useState(false)

  const [successMessage, setSuccessMessage] =
    useState("")

  const selectedService = SERVICES[service]
  const price = selectedService.prices[plateType]

  const minimumDate = new Date()
    .toISOString()
    .split("T")[0]

  useEffect(() => {
    async function loadBookedTimes() {
      if (!date) {
        setBookedTimes([])
        return
      }

      try {
        setLoadingTimes(true)

        const times = await getBookedTimes(date)

        setBookedTimes(times)
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Could not load appointment times."

        window.alert(message)
        setBookedTimes([])
      } finally {
        setLoadingTimes(false)
      }
    }

    void loadBookedTimes()
  }, [date])

  const availableTimes = useMemo(() => {
    if (!date) {
      return []
    }

    return AVAILABLE_TIMES.filter(
      (availableTime) =>
        !bookedTimes.includes(availableTime),
    )
  }, [bookedTimes, date])

  function isValidBusinessDay(
    selectedDate: string,
  ): boolean {
    const dateValue = new Date(
      `${selectedDate}T12:00:00`,
    )

    const day = dateValue.getDay()

    return day !== 0 && day !== 6
  }

  function handleDateChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const selectedDate = event.target.value

    if (!selectedDate) {
      setDate("")
      setTime("")
      return
    }

    if (!isValidBusinessDay(selectedDate)) {
      window.alert(
        "Please select a weekday from Monday to Friday.",
      )

      setDate("")
      setTime("")
      return
    }

    setDate(selectedDate)
    setTime("")
  }

  function clearForm() {
    setService("exterior")
    setPlateType("yellow")
    setDate("")
    setTime("")
    setFirstName("")
    setLastName("")
    setPhone("")
    setEmail("")
    setVehicle("")
    setModel("")
    setLicensePlate("")
    setNotes("")
  }

  async function sendConfirmationEmail(
    bookingId: string,
  ): Promise<boolean> {
    const {
      data,
      error,
    } = await supabase.functions.invoke(
      "send-booking-confirmation",
      {
        body: {
          bookingId,
        },
      },
    )

    if (error) {
      console.error(
        "Error invoking confirmation email function:",
        error,
      )

      return false
    }

    const result = data as {
      success?: boolean
      error?: string
    } | null

    if (result?.success !== true) {
      console.error(
        "Confirmation email function returned an error:",
        result,
      )

      return false
    }

    return true
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    if (submissionLock.current) {
      return
    }

    if (!date || !time) {
      window.alert(
        "Please select a date and time.",
      )

      return
    }

    if (!availableTimes.includes(time)) {
      window.alert(
        "This time is no longer available. Please select another time.",
      )

      setTime("")
      return
    }

    const selectedTime = time
    const customerFirstName = firstName

    submissionLock.current = true

    try {
      setSavingBooking(true)
      setSuccessMessage("")

      const bookingId = await createBooking({
        service,
        plateType,
        bookingDate: date,
        bookingTime: time,
        firstName,
        lastName,
        phone,
        email,
        vehicle,
        model,
        licensePlate,
        notes,
        price,
      })

      const confirmationEmailWasSent =
        await sendConfirmationEmail(bookingId)

      setBookedTimes((currentTimes) => [
        ...currentTimes,
        selectedTime,
      ])

      if (confirmationEmailWasSent) {
        setSuccessMessage(
          `Thank you, ${customerFirstName}! Your booking request was received. Please check your email to confirm your appointment.`,
        )
      } else {
        setSuccessMessage(
          `Thank you, ${customerFirstName}! Your booking request was received.`,
        )

        window.alert(
          "Your booking was saved, but the confirmation email could not be sent. We will contact you shortly.",
        )
      }

      clearForm()

      window.setTimeout(() => {
        document
          .getElementById("booking")
          ?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          })
      }, 100)
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not save the booking."

      window.alert(message)

      try {
        const updatedTimes =
          await getBookedTimes(date)

        setBookedTimes(updatedTimes)
      } catch {
        // Mantém a mensagem original.
      }

      setTime("")
    } finally {
      submissionLock.current = false
      setSavingBooking(false)
    }
  }

  return (
    <section
      className="booking-section"
      id="booking"
    >
      <div className="booking-container">
        <div className="booking-heading">
          <span>BOOKING</span>

          <h2>Book Your Appointment</h2>

          <p>
            Select your service, vehicle type,
            date and available time.
          </p>
        </div>

        {successMessage && (
          <div className="booking-success">
            <strong>
              {successMessage}
            </strong>

            <p>
              Your appointment will remain
              pending until it is confirmed.
            </p>
          </div>
        )}

        <form
          className="booking-form"
          onSubmit={handleSubmit}
        >
          <div className="booking-step">
            <h3>1. Select Service</h3>

            <div className="booking-options">
              <label
                className={`booking-option ${
                  service === "exterior"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="service"
                  value="exterior"
                  checked={service === "exterior"}
                  onChange={() =>
                    setService("exterior")
                  }
                />

                <div>
                  <strong>Exterior Wash</strong>

                  <span>
                    Approximately{" "}
                    {SERVICES.exterior.duration}{" "}
                    minutes
                  </span>
                </div>
              </label>

              <label
                className={`booking-option ${
                  service === "premium"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="service"
                  value="premium"
                  checked={service === "premium"}
                  onChange={() =>
                    setService("premium")
                  }
                />

                <div>
                  <strong>Premium Finish</strong>

                  <span>
                    Approximately{" "}
                    {SERVICES.premium.duration}{" "}
                    minutes
                  </span>
                </div>
              </label>
            </div>
          </div>

          <div className="booking-step">
            <h3>2. Vehicle Plate Type</h3>

            <div className="booking-options">
              <label
                className={`booking-option ${
                  plateType === "yellow"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="plateType"
                  value="yellow"
                  checked={plateType === "yellow"}
                  onChange={() =>
                    setPlateType("yellow")
                  }
                />

                <div>
                  <strong>Yellow Plate</strong>
                  <span>Compact vehicle</span>
                </div>
              </label>

              <label
                className={`booking-option ${
                  plateType === "white"
                    ? "selected"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name="plateType"
                  value="white"
                  checked={plateType === "white"}
                  onChange={() =>
                    setPlateType("white")
                  }
                />

                <div>
                  <strong>White Plate</strong>
                  <span>Standard vehicle</span>
                </div>
              </label>
            </div>
          </div>

          <div className="booking-step">
            <h3>3. Select Date</h3>

            <input
              className="booking-input"
              type="date"
              min={minimumDate}
              value={date}
              onChange={handleDateChange}
              required
            />

            <small>
              Appointments are available
              Monday through Friday.
            </small>
          </div>

          <div className="booking-step">
            <h3>4. Select Time</h3>

            {date && (
              <div className="booking-arrival-banner">
                <span className="booking-arrival-icon">
                  ℹ️
                </span>

                <span>
                  Please arrive{" "}
                  <strong>10 minutes before</strong>{" "}
                  your scheduled appointment
                  for vehicle check-in.
                </span>
              </div>
            )}

            {!date && (
              <p className="booking-information">
                Select a date to see available times.
              </p>
            )}

            {loadingTimes && (
              <p className="booking-information">
                Loading available times...
              </p>
            )}

            {date &&
              !loadingTimes &&
              availableTimes.length === 0 && (
                <p className="booking-information">
                  No appointments are
                  available on this date.
                </p>
              )}

            {!loadingTimes && (
              <div className="booking-times">
                {availableTimes.map(
                  (availableTime) => (
                    <button
                      key={availableTime}
                      className={`booking-time ${
                        time === availableTime
                          ? "selected"
                          : ""
                      }`}
                      type="button"
                      onClick={() =>
                        setTime(availableTime)
                      }
                    >
                      {availableTime}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>

          <div className="booking-step">
            <h3>5. Customer Information</h3>

            <div className="booking-fields">
              <input
                className="booking-input"
                type="text"
                placeholder="First Name *"
                value={firstName}
                onChange={(event) =>
                  setFirstName(event.target.value)
                }
                required
              />

              <input
                className="booking-input"
                type="text"
                placeholder="Last Name *"
                value={lastName}
                onChange={(event) =>
                  setLastName(event.target.value)
                }
                required
              />

              <input
                className="booking-input"
                type="tel"
                placeholder="Phone *"
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                required
              />

              <input
                className="booking-input"
                type="email"
                placeholder="Email *"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
              />

              <input
                className="booking-input"
                type="text"
                placeholder="Vehicle"
                value={vehicle}
                onChange={(event) =>
                  setVehicle(event.target.value)
                }
              />

              <input
                className="booking-input"
                type="text"
                placeholder="Model"
                value={model}
                onChange={(event) =>
                  setModel(event.target.value)
                }
              />

              <input
                className="booking-input"
                type="text"
                placeholder="License Plate (optional)"
                value={licensePlate}
                onChange={(event) =>
                  setLicensePlate(event.target.value)
                }
              />
            </div>

            <textarea
              className="booking-textarea"
              placeholder="Special Requests"
              value={notes}
              onChange={(event) =>
                setNotes(event.target.value)
              }
            />
          </div>

          <div className="booking-summary">
            <h3>Booking Summary</h3>

            <div>
              <span>Service</span>
              <strong>{selectedService.name}</strong>
            </div>

            <div>
              <span>Plate Type</span>

              <strong>
                {plateType === "yellow"
                  ? "Yellow Plate"
                  : "White Plate"}
              </strong>
            </div>

            <div>
              <span>Date</span>
              <strong>{date || "Not selected"}</strong>
            </div>

            <div>
              <span>Time</span>
              <strong>{time || "Not selected"}</strong>
            </div>

            <div className="booking-price">
              <span>Price</span>
              <strong>US${price}</strong>
            </div>
          </div>

          <button
            className="booking-submit"
            type="submit"
            disabled={
              savingBooking ||
              loadingTimes
            }
          >
            {savingBooking
              ? "BOOKING YOUR APPOINTMENT... PLEASE WAIT"
              : "BOOK APPOINTMENT"}
          </button>

          {savingBooking && (
            <p
              className="booking-information"
              role="status"
              aria-live="polite"
            >
              Please wait and do not close or
              refresh this page while your booking
              is being processed.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}

export default Booking