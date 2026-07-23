import {
  useEffect,
  useState,
} from "react"

import {
  confirmBookingByToken,
  type BookingConfirmationResult,
} from "../../services/bookingConfirmation"

import "./ConfirmBookingPage.css"

type ConfirmationPageStatus =
  | "loading"
  | "success"
  | "already-confirmed"
  | "expired"
  | "cancelled"
  | "not-found"
  | "error"

interface ConfirmationPageContent {
  status: ConfirmationPageStatus
  title: string
  message: string
}

function getConfirmationToken(): string | null {
  const pathParts = window.location.pathname
    .split("/")
    .filter(Boolean)

  const confirmIndex = pathParts.findIndex(
    (part) => part === "confirm",
  )

  if (
    confirmIndex === -1 ||
    !pathParts[confirmIndex + 1]
  ) {
    return null
  }

  return decodeURIComponent(
    pathParts[confirmIndex + 1],
  )
}

function getPageContent(
  result: BookingConfirmationResult,
): ConfirmationPageContent {
  switch (result.code) {
    case "booking_confirmed":
      return {
        status: "success",
        title: "Booking confirmed!",
        message:
          "Your appointment has been successfully confirmed. We look forward to seeing you.",
      }

    case "already_confirmed":
      return {
        status: "already-confirmed",
        title: "Booking already confirmed",
        message:
          "This appointment was already confirmed. No further action is required.",
      }

    case "confirmation_expired":
      return {
        status: "expired",
        title: "Confirmation link expired",
        message:
          "This confirmation link has expired. Please contact MN Premium Service for assistance.",
      }

    case "booking_cancelled":
    case "already_cancelled":
      return {
        status: "cancelled",
        title: "Booking unavailable",
        message:
          "This appointment has already been cancelled and can no longer be confirmed.",
      }

    case "booking_not_found":
      return {
        status: "not-found",
        title: "Booking not found",
        message:
          "We could not find an appointment linked to this confirmation link.",
      }

    default:
      return {
        status: "error",
        title: "Unable to confirm booking",
        message:
          result.message ||
          "An unexpected error occurred. Please try again or contact us.",
      }
  }
}

function getStatusIcon(
  status: ConfirmationPageStatus,
): string {
  switch (status) {
    case "success":
    case "already-confirmed":
      return "✓"

    case "loading":
      return ""

    case "expired":
      return "!"

    case "cancelled":
    case "not-found":
    case "error":
      return "×"

    default:
      return "!"
  }
}

function ConfirmBookingPage() {
  const [pageContent, setPageContent] =
    useState<ConfirmationPageContent>({
      status: "loading",
      title: "Confirming your booking",
      message:
        "Please wait while we securely confirm your appointment.",
    })

  useEffect(() => {
    let isActive = true

    async function confirmBooking() {
      const token = getConfirmationToken()

      if (!token) {
        if (!isActive) {
          return
        }

        setPageContent({
          status: "not-found",
          title: "Invalid confirmation link",
          message:
            "This confirmation link is incomplete or invalid.",
        })

        return
      }

      try {
        const result =
          await confirmBookingByToken(token)

        if (!isActive) {
          return
        }

        setPageContent(
          getPageContent(result),
        )
      } catch (error) {
        console.error(
          "Unexpected booking confirmation error:",
          error,
        )

        if (!isActive) {
          return
        }

        setPageContent({
          status: "error",
          title: "Unable to confirm booking",
          message:
            "An unexpected error occurred. Please try again or contact us.",
        })
      }
    }

    void confirmBooking()

    return () => {
      isActive = false
    }
  }, [])

  const isLoading =
    pageContent.status === "loading"

  const icon = getStatusIcon(
    pageContent.status,
  )

  function handleReturnHome() {
    window.location.href = "/"
  }

  function handleContact() {
    window.location.href =
      "tel:08032835986"
  }

  return (
    <main className="booking-confirmation-page">
      <section
        className={`booking-confirmation-card booking-confirmation-card--${pageContent.status}`}
        aria-live="polite"
      >
        <div className="booking-confirmation-brand">
          <span className="booking-confirmation-brand__name">
            MN Premium Service
          </span>

          <span className="booking-confirmation-brand__subtitle">
            Premium Auto Care
          </span>
        </div>

        <div
          className={`booking-confirmation-icon booking-confirmation-icon--${pageContent.status}`}
          aria-hidden="true"
        >
          {isLoading ? (
            <span className="booking-confirmation-spinner" />
          ) : (
            icon
          )}
        </div>

        <div className="booking-confirmation-content">
          <p className="booking-confirmation-eyebrow">
            Booking confirmation
          </p>

          <h1>{pageContent.title}</h1>

          <p className="booking-confirmation-message">
            {pageContent.message}
          </p>
        </div>

        {!isLoading && (
          <div className="booking-confirmation-actions">
            <button
              type="button"
              className="booking-confirmation-button booking-confirmation-button--primary"
              onClick={handleReturnHome}
            >
              Return to website
            </button>

            {pageContent.status !==
              "success" &&
              pageContent.status !==
                "already-confirmed" && (
                <button
                  type="button"
                  className="booking-confirmation-button booking-confirmation-button--secondary"
                  onClick={handleContact}
                >
                  Contact us
                </button>
              )}
          </div>
        )}

        <footer className="booking-confirmation-footer">
          <span>
            Please arrive 10 minutes before
            your scheduled time.
          </span>

          <span>
            Every Detail Matters.
          </span>
        </footer>
      </section>
    </main>
  )
}

export default ConfirmBookingPage