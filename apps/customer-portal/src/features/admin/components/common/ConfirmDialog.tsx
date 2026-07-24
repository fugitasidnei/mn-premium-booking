import {
  useEffect,
  type ReactNode,
} from "react"

import {
  AdminButton,
} from "../layout/ui"

import "./ConfirmDialog.css"

type ConfirmDialogProps = {
  isOpen: boolean
  title: string
  description?: string
  children?: ReactNode
  confirmLabel?: string
  loadingLabel?: string
  cancelLabel?: string
  isLoading?: boolean
  variant?: "danger" | "warning"
  onConfirm: () => void | Promise<void>
  onClose: () => void
}

function ConfirmDialog({
  isOpen,
  title,
  description,
  children,
  confirmLabel = "Confirm",
  loadingLabel = "Processing...",
  cancelLabel = "Cancel",
  isLoading = false,
  variant = "danger",
  onConfirm,
  onClose,
}: ConfirmDialogProps) {
  useEffect(() => {
    if (!isOpen) {
      return undefined
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

    const previousOverflow =
      document.body.style.overflow

    document.body.style.overflow =
      "hidden"

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      )

      document.body.style.overflow =
        previousOverflow
    }
  }, [
    isOpen,
    isLoading,
    onClose,
  ])

  if (!isOpen) {
    return null
  }

  async function handleConfirm() {
    if (isLoading) {
      return
    }

    await onConfirm()
  }

  return (
    <div
      className="confirm-dialog-overlay"
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
        aria-labelledby="confirm-dialog-title"
        aria-modal="true"
        className="confirm-dialog"
        role="dialog"
      >
        <div
          className={[
            "confirm-dialog__icon",
            `confirm-dialog__icon--${variant}`,
          ].join(" ")}
          aria-hidden="true"
        >
          !
        </div>

        <div className="confirm-dialog__content">
          <h2 id="confirm-dialog-title">
            {title}
          </h2>

          {description && (
            <p className="confirm-dialog__description">
              {description}
            </p>
          )}

          {children && (
            <div className="confirm-dialog__details">
              {children}
            </div>
          )}
        </div>

        <div className="confirm-dialog__actions">
          <AdminButton
            variant="secondary"
            disabled={isLoading}
            onClick={onClose}
          >
            {cancelLabel}
          </AdminButton>

          <AdminButton
            variant={
              variant === "danger"
                ? "danger"
                : "warning"
            }
            disabled={isLoading}
            onClick={() => {
              void handleConfirm()
            }}
          >
            {isLoading
              ? loadingLabel
              : confirmLabel}
          </AdminButton>
        </div>
      </section>
    </div>
  )
}

export default ConfirmDialog