import {
  AdminButton,
} from "../../layout/ui"

import type {
  BookingStatus,
} from "../../../../../types/adminBooking"

type BookingFooterProps = {
  bookingId: string
  bookingStatus: BookingStatus
  isActionLoading: boolean

  onClose: () => void
  onEdit: () => void

  onConfirm: (
    bookingId: string,
  ) => Promise<void>

  onCancel: (
    bookingId: string,
  ) => Promise<void>

  onDeleteRequest: () => void
}

function BookingFooter({
  bookingId,
  bookingStatus,
  isActionLoading,
  onClose,
  onEdit,
  onConfirm,
  onCancel,
  onDeleteRequest,
}: BookingFooterProps) {
  async function handleConfirm() {
    await onConfirm(bookingId)
  }

  async function handleCancel() {
    const shouldCancel =
      window.confirm(
        "Are you sure you want to cancel this booking?",
      )

    if (!shouldCancel) {
      return
    }

    await onCancel(bookingId)
  }

  return (
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

      <AdminButton
        variant="danger"
        disabled={isActionLoading}
        onClick={onDeleteRequest}
      >
        Delete
      </AdminButton>

      {bookingStatus !== "cancelled" && (
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

      {bookingStatus !== "confirmed" && (
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
  )
}

export default BookingFooter