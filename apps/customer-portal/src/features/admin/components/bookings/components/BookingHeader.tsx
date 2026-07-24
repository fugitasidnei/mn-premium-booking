import {
  AdminBadge,
} from "../../layout/ui"

import type {
  BookingStatus,
} from "../../../../../types/adminBooking"

type CustomerLevel =
  | "standard"
  | "returning"
  | "vip"

type BookingHeaderProps = {
  customerName: string
  bookingStatus: BookingStatus
  customerLevel: CustomerLevel
  onClose: () => void
}

function getStatusLabel(
  status: BookingStatus,
): string {
  if (status === "confirmed") {
    return "Confirmed"
  }

  if (status === "cancelled") {
    return "Cancelled"
  }

  return "Pending"
}

function getStatusVariant(
  status: BookingStatus,
):
  | "pending"
  | "confirmed"
  | "cancelled" {
  return status
}

function getCustomerLevelLabel(
  level: CustomerLevel,
): string {
  if (level === "vip") {
    return "VIP Customer"
  }

  if (level === "returning") {
    return "Returning Customer"
  }

  return "Standard Customer"
}

function getCustomerLevelVariant(
  level: CustomerLevel,
):
  | "success"
  | "warning"
  | "neutral" {
  if (level === "vip") {
    return "success"
  }

  if (level === "returning") {
    return "warning"
  }

  return "neutral"
}

function BookingHeader({
  customerName,
  bookingStatus,
  customerLevel,
  onClose,
}: BookingHeaderProps) {
  return (
    <header className="booking-details-drawer__header">
      <div>
        <span className="booking-details-drawer__eyebrow">
          Booking details
        </span>

        <h2 id="booking-details-title">
          {customerName}
        </h2>

        <div className="booking-details-drawer__badges">
          <AdminBadge
            variant={getStatusVariant(
              bookingStatus,
            )}
          >
            {getStatusLabel(
              bookingStatus,
            )}
          </AdminBadge>

          <AdminBadge
            variant={getCustomerLevelVariant(
              customerLevel,
            )}
          >
            {getCustomerLevelLabel(
              customerLevel,
            )}
          </AdminBadge>
        </div>
      </div>

      <button
        aria-label="Close booking details"
        className="booking-details-drawer__close"
        type="button"
        onClick={onClose}
      >
        ×
      </button>
    </header>
  )
}

export default BookingHeader