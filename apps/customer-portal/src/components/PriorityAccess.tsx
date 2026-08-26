import {
  useState,
} from "react"

import "./PriorityAccess.css"

import {
  joinWaitingList,
} from "../services/waitingList"

const PRIORITY_BENEFITS = [
  "Free to join",
  "Requests handled in the order received",
  "Fast notification when a spot opens",
  "Confirmation is required",
]

function PriorityAccess() {
  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false)

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("")

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("")

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    const form =
      event.currentTarget

    const formData =
      new FormData(form)

    const fullName =
      String(
        formData.get(
          "waitlistName",
        ) ?? "",
      ).trim()

    const phone =
      String(
        formData.get(
          "waitlistPhone",
        ) ?? "",
      ).trim()

    const email =
      String(
        formData.get(
          "waitlistEmail",
        ) ?? "",
      ).trim()

    const vehicle =
      String(
        formData.get(
          "waitlistVehicle",
        ) ?? "",
      ).trim()

    const service =
      String(
        formData.get(
          "waitlistService",
        ) ?? "",
      )

    const preferredDate =
      String(
        formData.get(
          "waitlistDate",
        ) ?? "",
      )

    const preferredTime =
      String(
        formData.get(
          "waitlistTime",
        ) ?? "",
      )

    const plateType =
      String(
        formData.get(
          "waitlistPlate",
        ) ?? "",
      )

    try {
      setIsSubmitting(true)
      setSuccessMessage("")
      setErrorMessage("")

      await joinWaitingList({
        fullName,
        phone,
        email,
        vehicle,
        service,
        preferredDate,
        preferredTime,
        plateType,
      })

      setSuccessMessage(
        "You have successfully joined the Priority Access List. We will contact you when a suitable appointment becomes available.",
      )

      form.reset()
    } catch (error) {
      console.error(
        "Error joining waiting list:",
        error,
      )

      setErrorMessage(
        "We could not add you to the Priority Access List. Please try again.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      className="priority-section"
      id="priority-access"
    >
      <div className="priority-container">
        <div className="priority-heading">
          <span>
            PRIORITY ACCESS
          </span>

          <h2>
            Be First in Line When a Spot Opens
          </h2>

          <p>
            No suitable appointment available?
            Join our Priority Access List and
            we will contact you when a
            cancellation creates an opening.
          </p>
        </div>

        <div className="priority-layout">
          <aside className="priority-info">
            <div
              className="priority-info-icon"
              aria-hidden="true"
            >
              ★
            </div>

            <span className="priority-info-label">
              WAITING LIST BENEFITS
            </span>

            <h3>
              Priority Members Receive
              First Access
            </h3>

            <ul>
              {PRIORITY_BENEFITS.map(
                (benefit) => (
                  <li key={benefit}>
                    <span
                      className="priority-check"
                      aria-hidden="true"
                    >
                      ✓
                    </span>

                    <span>
                      {benefit}
                    </span>
                  </li>
                ),
              )}
            </ul>

            <div className="priority-rule">
              <strong>
                30-minute confirmation window
              </strong>

              <p>
                You will have 30 minutes to
                confirm. If no confirmation is
                received, the appointment will
                be offered to the next customer.
              </p>
            </div>
          </aside>

          <form
            className="priority-form"
            onSubmit={handleSubmit}
          >
            <div className="priority-form-heading">
              <span>
                JOIN THE LIST
              </span>

              <h3>
                Priority Access Request
              </h3>

              <p>
                Complete your information and
                preferred appointment details.
              </p>
            </div>

            {successMessage && (
              <div className="priority-success">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="priority-error">
                {errorMessage}
              </div>
            )}

            <div className="priority-grid">
              <label>
                <span>
                  Full Name
                </span>

                <input
                  type="text"
                  name="waitlistName"
                  placeholder="Your full name"
                  autoComplete="name"
                  required
                />
              </label>

              <label>
                <span>
                  Phone Number
                </span>

                <input
                  type="tel"
                  name="waitlistPhone"
                  placeholder="Your phone number"
                  autoComplete="tel"
                  required
                />
              </label>

              <label>
                <span>
                  Email
                </span>

                <input
                  type="email"
                  name="waitlistEmail"
                  placeholder="Your email address"
                  autoComplete="email"
                  required
                />
              </label>

              <label>
                <span>
                  Vehicle
                </span>

                <input
                  type="text"
                  name="waitlistVehicle"
                  placeholder="Example: Toyota Aqua"
                  required
                />
              </label>

              <label>
                <span>
                  Service
                </span>

                <select
                  name="waitlistService"
                  required
                  defaultValue=""
                >
                  <option
                    value=""
                    disabled
                  >
                    Select a service
                  </option>

                  <option value="simple-wash">
                    Simple Wash
                  </option>

                  <option value="premium-detail">
                    Premium Detail
                  </option>
                </select>
              </label>

              <label>
                <span>
                  Preferred Date
                </span>

                <input
                  type="date"
                  name="waitlistDate"
                  required
                />
              </label>

              <label>
                <span>
                  Preferred Time
                </span>

                <select
                  name="waitlistTime"
                  required
                  defaultValue=""
                >
                  <option
                    value=""
                    disabled
                  >
                    Select a preference
                  </option>

                  <option value="morning">
                    Morning
                  </option>

                  <option value="afternoon">
                    Afternoon
                  </option>

                  <option value="any-time">
                    Any Time
                  </option>
                </select>
              </label>

              <label>
                <span>
                  Plate Type
                </span>

                <select
                  name="waitlistPlate"
                  required
                  defaultValue=""
                >
                  <option
                    value=""
                    disabled
                  >
                    Select plate type
                  </option>

                  <option value="yellow">
                    Yellow Plate
                  </option>

                  <option value="white">
                    White Plate
                  </option>
                </select>
              </label>
            </div>

            <button
              type="submit"
              className="priority-button"
              disabled={
                isSubmitting
              }
            >
              {isSubmitting
                ? "JOINING..."
                : "JOIN PRIORITY ACCESS"}
            </button>

            <p className="priority-form-note">
              Joining the list does not guarantee
              an appointment. We will contact you
              when a suitable spot becomes
              available.
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}

export default PriorityAccess