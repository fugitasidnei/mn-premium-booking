import "./DeleteBookingDialog.css"

import {
  useEffect,
  useState,
} from "react"

import {
  AdminButton,
} from "../../layout/ui"

type DeleteBookingDialogProps = {
  bookingId: string
  customerName: string
  isOpen: boolean
  isLoading: boolean
  onClose: () => void

  onDelete: (
    bookingId: string,
  ) => Promise<void>
}

function DeleteBookingDialog({
  bookingId,
  customerName,
  isOpen,
  isLoading,
  onClose,
  onDelete,
}: DeleteBookingDialogProps) {
  const [confirmationText, setConfirmationText] =
    useState("")

  useEffect(() => {
    if (!isOpen) {
      setConfirmationText("")
      return
    }

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (
        event.key === "Escape" &&
        !isLoading
      ) {
        onClose()
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown,
    )

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      )
    }
  }, [
    isOpen,
    isLoading,
    onClose,
  ])

  if (!isOpen) {
    return null
  }

  const canDelete =
    confirmationText
      .trim()
      .toLocaleLowerCase() ===
    "delete"

  async function handleDelete() {
    if (!canDelete || isLoading) {
      return
    }

    await onDelete(bookingId)
    onClose()
  }

  return (
    <div
      className="delete-booking-dialog__overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
            event.currentTarget &&
          !isLoading
        ) {
          onClose()
        }
      }}
    >
      <section
        aria-labelledby="delete-booking-title"
        aria-modal="true"
        className="delete-booking-dialog"
        role="dialog"
      >
        <div className="delete-booking-dialog__header">
          <div>
            <span>Permanent action</span>

            <h2 id="delete-booking-title">
              Delete booking?
            </h2>
          </div>

          <button
            aria-label="Close delete dialog"
            disabled={isLoading}
            type="button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        <div className="delete-booking-dialog__content">
          <p>
            This will permanently delete the
            booking for{" "}
            <strong>{customerName}</strong>.
          </p>

          <p>
            This action cannot be undone.
          </p>

          <label htmlFor="delete-booking-confirmation">
            Type <strong>DELETE</strong> to
            confirm:
          </label>

          <input
            autoComplete="off"
            id="delete-booking-confirmation"
            placeholder="DELETE"
            type="text"
            value={confirmationText}
            onChange={(event) =>
              setConfirmationText(
                event.target.value,
              )
            }
          />
        </div>

        <div className="delete-booking-dialog__footer">
          <AdminButton
            variant="secondary"
            disabled={isLoading}
            onClick={onClose}
          >
            Keep booking
          </AdminButton>

          <AdminButton
            variant="danger"
            disabled={
              !canDelete ||
              isLoading
            }
            onClick={() => {
              void handleDelete()
            }}
          >
            {isLoading
              ? "Deleting..."
              : "Delete permanently"}
          </AdminButton>
        </div>
      </section>
    </div>
  )
}

export default DeleteBookingDialog