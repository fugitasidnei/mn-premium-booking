import "./BookingDetailsDrawer.css"

import {
  useEffect,
  useMemo,
  useState,
} from "react"

import BookingFooter from "./components/BookingFooter"
import BookingHeader from "./components/BookingHeader"
import BookingHistory from "./components/BookingHistory"
import BookingLoyalty from "./components/BookingLoyalty"
import BookingNotes from "./components/BookingNotes"
import type {
  LoyaltyProgress,
} from "./components/BookingLoyalty"
import BookingOverview from "./components/BookingOverview"
import BookingTabs from "./components/BookingTabs"
import BookingTimeline from "./components/BookingTimeline"
import DeleteBookingDialog from "./components/DeleteBookingDialog"
import type {
  BookingDetailsTab,
} from "./components/BookingTabs"

import {
  useBookingTimeline,
} from "../../../../hooks/useBookingTimeline"

import type {
  AdminBooking,
} from "../../../../types/adminBooking"

type CustomerLevel =
  | "standard"
  | "returning"
  | "vip"

type BookingDetailsDrawerProps = {
  booking: AdminBooking | null
  allBookings?: AdminBooking[]
  actionBookingId: string | null

  onClose: () => void

  onEdit: () => void

  onConfirm: (
    bookingId: string,
  ) => Promise<void>

  onCancel: (
    bookingId: string,
  ) => Promise<void>

  onDelete: (
    bookingId: string,
  ) => Promise<void>
}

interface CustomerStatistics {
  customerBookings: AdminBooking[]
  confirmedBookings: AdminBooking[]
  cancelledBookings: AdminBooking[]
  totalBookings: number
  confirmedCount: number
  cancelledCount: number
  totalSpent: number
  averageTicket: number
  firstBookingDate: string | null
  lastBookingDate: string | null
  level: CustomerLevel
}

function normalizeText(
  value: unknown,
): string {
  return String(value ?? "")
    .trim()
    .toLocaleLowerCase()
}

function normalizePhone(
  value: string,
): string {
  return value.replace(/\D/g, "")
}

function getCustomerName(
  booking: AdminBooking,
): string {
  return [
    booking.first_name,
    booking.last_name,
  ]
    .filter(Boolean)
    .join(" ")
    .trim()
}

function getCustomerLevel(
  confirmedBookings: number,
): CustomerLevel {
  if (confirmedBookings >= 12) {
    return "vip"
  }

  if (confirmedBookings >= 2) {
    return "returning"
  }

  return "standard"
}

function isSameCustomer(
  selectedBooking: AdminBooking,
  comparedBooking: AdminBooking,
): boolean {
  const selectedEmail =
    normalizeText(
      selectedBooking.email,
    )

  const comparedEmail =
    normalizeText(
      comparedBooking.email,
    )

  if (
    selectedEmail &&
    comparedEmail &&
    selectedEmail === comparedEmail
  ) {
    return true
  }

  const selectedPhone =
    normalizePhone(
      selectedBooking.phone,
    )

  const comparedPhone =
    normalizePhone(
      comparedBooking.phone,
    )

  if (
    selectedPhone &&
    comparedPhone &&
    selectedPhone === comparedPhone
  ) {
    return true
  }

  const selectedName =
    normalizeText(
      getCustomerName(
        selectedBooking,
      ),
    )

  const comparedName =
    normalizeText(
      getCustomerName(
        comparedBooking,
      ),
    )

  return (
    Boolean(selectedName) &&
    selectedName === comparedName
  )
}

function getCustomerStatistics(
  booking: AdminBooking,
  allBookings: AdminBooking[],
): CustomerStatistics {
  const sourceBookings =
    allBookings.length > 0
      ? allBookings
      : [booking]

  const customerBookings =
    sourceBookings
      .filter((currentBooking) =>
        isSameCustomer(
          booking,
          currentBooking,
        ),
      )
      .sort(
        (
          firstBooking,
          secondBooking,
        ) => {
          const firstDateTime =
            `${firstBooking.booking_date} ${firstBooking.booking_time}`

          const secondDateTime =
            `${secondBooking.booking_date} ${secondBooking.booking_time}`

          return secondDateTime.localeCompare(
            firstDateTime,
          )
        },
      )

  const confirmedBookings =
    customerBookings.filter(
      (currentBooking) =>
        currentBooking.status ===
        "confirmed",
    )

  const cancelledBookings =
    customerBookings.filter(
      (currentBooking) =>
        currentBooking.status ===
        "cancelled",
    )

  const totalSpent =
    confirmedBookings.reduce(
      (total, currentBooking) =>
        total +
        (Number(
          currentBooking.price,
        ) || 0),
      0,
    )

  const averageTicket =
    confirmedBookings.length > 0
      ? totalSpent /
        confirmedBookings.length
      : 0

  const chronologicalBookings =
    [...customerBookings].sort(
      (
        firstBooking,
        secondBooking,
      ) =>
        firstBooking.booking_date
          .localeCompare(
            secondBooking.booking_date,
          ),
    )

  return {
    customerBookings,
    confirmedBookings,
    cancelledBookings,
    totalBookings:
      customerBookings.length,
    confirmedCount:
      confirmedBookings.length,
    cancelledCount:
      cancelledBookings.length,
    totalSpent,
    averageTicket,
    firstBookingDate:
      chronologicalBookings[0]
        ?.booking_date ?? null,
    lastBookingDate:
      customerBookings[0]
        ?.booking_date ?? null,
    level: getCustomerLevel(
      confirmedBookings.length,
    ),
  }
}

function getLoyaltyProgress(
  confirmedVisits: number,
): LoyaltyProgress {
  const completedCycles =
    Math.floor(
      confirmedVisits / 12,
    )

  const currentCycleVisits =
    confirmedVisits % 12

  const nextRewardAt =
    currentCycleVisits < 6
      ? 6
      : 12

  const visitsUntilReward =
    nextRewardAt -
    currentCycleVisits

  const rewardName =
    nextRewardAt === 6
      ? "Interior Air Freshener"
      : "Free Wash"

  const progressPercentage =
    Math.min(
      100,
      (currentCycleVisits / 12) *
        100,
    )

  return {
    confirmedVisits,
    completedCycles,
    currentCycleVisits,
    nextRewardAt,
    visitsUntilReward,
    rewardName,
    progressPercentage,
  }
}

function BookingDetailsDrawer({
  booking,
  allBookings = [],
  actionBookingId,
  onClose,
  onEdit,
  onConfirm,
  onCancel,
  onDelete,
}: BookingDetailsDrawerProps) {
  const [
    activeTab,
    setActiveTab,
  ] =
    useState<BookingDetailsTab>(
      "overview",
    )

  const [
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
  ] = useState(false)

    
  const {
    timeline,
    isLoading: isTimelineLoading,
    error: timelineError,
  } = useBookingTimeline(
    booking?.id ?? null,
  )

  const customerStatistics =
    useMemo(() => {
      if (!booking) {
        return null
      }

      return getCustomerStatistics(
        booking,
        allBookings,
      )
    }, [
      booking,
      allBookings,
    ])

  const loyaltyProgress =
    useMemo(() => {
      return getLoyaltyProgress(
        customerStatistics
          ?.confirmedCount ?? 0,
      )
    }, [customerStatistics])

  useEffect(() => {
    if (!booking) {
      return undefined
    }

    setActiveTab("overview")

    function handleKeyDown(
      event: KeyboardEvent,
    ) {
      if (event.key === "Escape") {
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
    booking,
    onClose,
  ])

  if (
    !booking ||
    !customerStatistics
  ) {
    return null
  }

  const isActionLoading =
    actionBookingId === booking.id

  const customerName =
    getCustomerName(booking) ||
    "Customer"

  return (
    <div
      className="booking-details-overlay"
      role="presentation"
      onMouseDown={(event) => {
        if (
          event.target ===
          event.currentTarget
        ) {
          onClose()
        }
      }}
    >
      <aside
        aria-labelledby="booking-details-title"
        aria-modal="true"
        className="booking-details-drawer"
        role="dialog"
      >
        <BookingHeader
          customerName={customerName}
          bookingStatus={booking.status}
          customerLevel={customerStatistics.level}
          onClose={onClose}
        />

        <BookingTabs
          activeTab={activeTab}
          onChange={setActiveTab}
        />

        <div className="booking-details-drawer__content">
          {activeTab === "overview" && (
            <BookingOverview
              booking={booking}
              customerName={customerName}
              statistics={customerStatistics}
            />
          )}

          {activeTab === "history" && (
            <BookingHistory
              bookings={
                customerStatistics.customerBookings
              }
              totalBookings={
                customerStatistics.totalBookings
              }
            />
          )}

          {activeTab === "loyalty" && (
            <BookingLoyalty
              progress={loyaltyProgress}
            />
          )}

          {activeTab === "notes" && (
            <BookingNotes
              notes={booking.notes}
            />
          )}

          {activeTab === "timeline" && (
            <BookingTimeline
              timeline={timeline}
              isLoading={isTimelineLoading}
              error={timelineError}
            />
          )}
        </div>

        <BookingFooter
          bookingId={booking.id}
          bookingStatus={booking.status}
          isActionLoading={isActionLoading}
          onClose={onClose}
          onEdit={onEdit}
          onConfirm={onConfirm}
          onCancel={onCancel}
          onDeleteRequest={() =>
            setIsDeleteDialogOpen(true)
          }
        />
      </aside>

      <DeleteBookingDialog
        bookingId={booking.id}
        customerName={customerName}
        isOpen={isDeleteDialogOpen}
        isLoading={isActionLoading}
        onClose={() =>
          setIsDeleteDialogOpen(false)
        }
        onDelete={onDelete}
      />
    </div>
  )
}

export default BookingDetailsDrawer