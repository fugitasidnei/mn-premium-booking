import {
  useEffect,
  type ReactNode,
} from "react"

interface AdminDrawerProps {
  isOpen: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

function AdminDrawer({
  isOpen,
  title,
  children,
  onClose,
}: AdminDrawerProps) {
  useEffect(() => {
    if (!isOpen) {
      return
    }

    function handleEscape(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
        onClose()
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape,
    )

    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape,
      )

      document.body.style.overflow = ""
    }
  }, [isOpen, onClose])

  if (!isOpen) {
    return null
  }

  return (
    <div
      className="admin-drawer"
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <button
        type="button"
        className="admin-drawer__overlay"
        aria-label="Close drawer"
        onClick={onClose}
      />

      <aside className="admin-drawer__panel">
        <header className="admin-drawer__header">
          <div>
            <span className="admin-drawer__eyebrow">
              Booking Manager
            </span>

            <h2>{title}</h2>
          </div>

          <button
            type="button"
            className="admin-drawer__close"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </header>

        <div className="admin-drawer__content">
          {children}
        </div>
      </aside>
    </div>
  )
}

export default AdminDrawer