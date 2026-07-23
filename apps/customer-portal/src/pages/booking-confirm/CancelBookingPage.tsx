import {
  useEffect,
  useState,
} from "react"

import {
  cancelBookingByToken,
  type BookingConfirmationResult,
} from "../../services/bookingConfirmation"

import "./CancelBookingPage.css"

type CancellationPageStatus =
  | "loading"
  | "success"
  | "already-cancelled"
  | "expired"
  | "confirmed"
  | "not-found"
  | "error"

interface CancellationPageContent {
  status: CancellationPageStatus
  title: string
  message: string
}

function getCancellationToken(): string | null {
  const pathParts = window.location.pathname
    .split("/")
    .filter(Boolean)

  const cancelIndex = pathParts.findIndex(
    (part) => part === "cancel",
  )

  if (
    cancelIndex === -1 ||
    !pathParts[cancelIndex + 1]
  ) {
    return null
  }

  return decodeURIComponent(
    pathParts[cancelIndex + 1],
  )
}

function getPageContent(
  result: BookingConfirmationResult,
): CancellationPageContent {
  switch (result.code) {
    case "booking_cancelled":
      return {
        status: "success",
        title: "Booking cancelled",
        message:
          "Your appointment has been successfully cancelled. The time slot is now available again.",
      }

    case "already_cancelled":
      return {
        status: "already-cancelled",
        title: "Booking already cancelled",
        message:
          "This appointment had already been cancelled. No further action is required.",
      }

    case "booking_already_confirmed":
    case "already_confirmed":
      return {
        status: "confirmed",
        title: "Booking already confirmed",
        message:
          "This appointment has already been confirmed and cannot be cancelled using this link. Please contact MN Premium Service.",
      }

    case "confirmation_expired":
      return {
        status: "expired",
        title: "Cancellation link expired",
        message:
          "This cancellation link has expired. Please contact MN Premium Service for assistance.",
      }

    case "booking_not_found":
      return {
        status: "not-found",
        title: "Booking not found",
        message:
          "We could not find an appointment linked to this cancellation link.",
      }

    default:
      return {
        status: "error",
        title: "Unable to cancel booking",
        message:
          result.message ||
          "An unexpected error occurred. Please try again or contact us.",
      }
  }
}

function getStatusIcon(
  status: CancellationPageStatus,
): string {
  switch (status) {
    case "success":
    case "already-cancelled":
      return "✓"

    case "loading":
      return ""

    case "expired":
    case "confirmed":
      return "!"

    case "not-found":
    case "error":
      return "×"

    default:
      return "!"
  }
}

function CancelBookingPage() {
  const [pageContent, setPageContent] =
    useState<CancellationPageContent>({
      status: "loading",
      title: "Cancelling your booking",
      message:
        "Please wait while we securely process your cancellation.",
    })

  useEffect(() => {
    let isActive = true

    async function cancelBooking() {
      const token = getCancellationToken()

      if (!token) {
        if (!isActive) {
          return
        }

        setPageContent({
          status: "not-found",
          title: "Invalid cancellation link",
          message:
            "This cancellation link is incomplete or invalid.",
        })

        return
      }

      try {
        const result =
          await cancelBookingByToken(token)

        if (!isActive) {
          return
        }

        setPageContent(
          getPageContent(result),
        )
      } catch (error) {
        console.error(
          "Unexpected booking cancellation error:",
          error,
        )

        if (!isActive) {
          return
        }

        setPageContent({
          status: "error",
          title: "Unable to cancel booking",
          message:
            "An unexpected error occurred. Please try again or contact us.",
        })
      }
    }

    void cancelBooking()

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
    <main className="booking-cancellation-page">
      <section
        className={`booking-cancellation-card booking-cancellation-card--${pageContent.status}`}
        aria-live="polite"
      >
        <div className="booking-cancellation-brand">
          <span className="booking-cancellation-brand__name">
            MN Premium Service
          </span>

          <span className="booking-cancellation-brand__subtitle">
            Premium Auto Care
          </span>
        </div>

        <div
          className={`booking-cancellation-icon booking-cancellation-icon--${pageContent.status}`}
          aria-hidden="true"
        >
          {isLoading ? (
            <span className="booking-cancellation-spinner" />
          ) : (
            icon
          )}
        </div>

        <div className="booking-cancellation-content">
          <p className="booking-cancellation-eyebrow">
            Booking cancellation
          </p>

          <h1>{pageContent.title}</h1>

          <p className="booking-cancellation-message">
            {pageContent.message}
          </p>
        </div>

        {!isLoading && (
          <div className="booking-cancellation-actions">
            <button
              type="button"
              className="booking-cancellation-button booking-cancellation-button--primary"
              onClick={handleReturnHome}
            >
              Return to website
            </button>

            {pageContent.status !==
              "success" &&
              pageContent.status !==
                "already-cancelled" && (
                <button
                  type="button"
                  className="booking-cancellation-button booking-cancellation-button--secondary"
                  onClick={handleContact}
                >
                  Contact us
                </button>
              )}
          </div>
        )}

        <footer className="booking-cancellation-footer">
          <span>
            Need another appointment? You can
            make a new booking on our website.
          </span>

          <span>
            Every Detail Matters.
          </span>
        </footer>
      </section>
    </main>
  )
}

export default CancelBookingPage