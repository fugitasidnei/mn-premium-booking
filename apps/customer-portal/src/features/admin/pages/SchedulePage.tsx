import {
  useMemo,
  useState,
} from "react"

import type {
  ChangeEvent,
} from "react"

import EditBookingDrawer from "../components/EditBookingDrawer"
import NewBookingDrawer from "../components/NewBookingDrawer"
import ScheduleBlockDrawer from "../components/ScheduleBlockDrawer"

import {
  useAdminBookings,
} from "../../../hooks/useAdminBookings"

import {
  useScheduleBlocks,
} from "../../../hooks/useScheduleBlocks"

import type {
  AdminBooking,
  BookingService,
} from "../../../types/adminBooking"

import type {
  NewScheduleBlock,
  ScheduleBlock,
} from "../../../types/scheduleBlock"

import "./SchedulePage.css"

type ScheduleView =
  | "day"
  | "week"

const SLOT_DURATION_MINUTES = 30
const SCHEDULE_ROW_HEIGHT = 72

const scheduleHours = [
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
]

function formatDateForInput(
  date: Date,
): string {
  const year = date.getFullYear()

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, "0")

  const day = String(
    date.getDate(),
  ).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function formatSelectedDate(
  date: Date,
): string {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  ).format(date)
}

function formatWeekRange(
  weekDays: Date[],
): string {
  const firstDay =
    weekDays[0]

  const lastDay =
    weekDays[
      weekDays.length - 1
    ]

  const firstLabel =
    new Intl.DateTimeFormat(
      "en-US",
      {
        month: "short",
        day: "numeric",
      },
    ).format(firstDay)

  const lastLabel =
    new Intl.DateTimeFormat(
      "en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
      },
    ).format(lastDay)

  return `${firstLabel} – ${lastLabel}`
}

function formatWeekDayName(
  date: Date,
): string {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      weekday: "short",
    },
  ).format(date)
}

function formatWeekDayNumber(
  date: Date,
): string {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      day: "numeric",
    },
  ).format(date)
}

function formatWeekDayMonth(
  date: Date,
): string {
  return new Intl.DateTimeFormat(
    "en-US",
    {
      month: "short",
    },
  ).format(date)
}

function formatBookingTime(
  time: string,
): string {
  return time.slice(0, 5)
}

function getCustomerName(
  booking: AdminBooking,
): string {
  return `${booking.first_name} ${booking.last_name}`.trim()
}

function getServiceName(
  service: BookingService,
): string {
  if (service === "premium") {
    return "Premium Finish"
  }

  return "Exterior Wash"
}

function getServiceDuration(
  service: BookingService,
): number {
  if (service === "premium") {
    return 150
  }

  return 90
}

function timeToMinutes(
  time: string,
): number {
  const [hours, minutes] =
    formatBookingTime(time)
      .split(":")
      .map(Number)

  return (
    hours * 60 +
    minutes
  )
}

function minutesToTime(
  totalMinutes: number,
): string {
  const hours = Math.floor(
    totalMinutes / 60,
  )

  const minutes =
    totalMinutes % 60

  return `${String(hours).padStart(
    2,
    "0",
  )}:${String(minutes).padStart(
    2,
    "0",
  )}`
}

function getBookingEndTime(
  booking: AdminBooking,
): string {
  const startMinutes =
    timeToMinutes(
      booking.booking_time,
    )

  return minutesToTime(
    startMinutes +
      getServiceDuration(
        booking.service,
      ),
  )
}

function getBookingHeight(
  booking: AdminBooking,
): number {
  const slotCount =
    getServiceDuration(
      booking.service,
    ) /
    SLOT_DURATION_MINUTES

  return (
    slotCount *
      SCHEDULE_ROW_HEIGHT -
    18
  )
}

function getScheduleBlockDuration(
  block: ScheduleBlock,
): number {
  return (
    timeToMinutes(
      block.end_time,
    ) -
    timeToMinutes(
      block.start_time,
    )
  )
}

function getScheduleBlockHeight(
  block: ScheduleBlock,
): number {
  const slotCount =
    getScheduleBlockDuration(
      block,
    ) /
    SLOT_DURATION_MINUTES

  return Math.max(
    SCHEDULE_ROW_HEIGHT - 18,
    slotCount *
      SCHEDULE_ROW_HEIGHT -
      18,
  )
}

function getWeekDays(
  selectedDate: Date,
): Date[] {
  const firstDay =
    new Date(selectedDate)

  const currentWeekDay =
    firstDay.getDay()

  const mondayOffset =
    currentWeekDay === 0
      ? -6
      : 1 - currentWeekDay

  firstDay.setDate(
    firstDay.getDate() +
      mondayOffset,
  )

  firstDay.setHours(
    0,
    0,
    0,
    0,
  )

  return Array.from(
    {
      length: 7,
    },
    (_, index) => {
      const date =
        new Date(firstDay)

      date.setDate(
        firstDay.getDate() +
          index,
      )

      return date
    },
  )
}

function isSameDate(
  firstDate: Date,
  secondDate: Date,
): boolean {
  return (
    formatDateForInput(
      firstDate,
    ) ===
    formatDateForInput(
      secondDate,
    )
  )
}

function getOccupiedSlots(
  bookings: AdminBooking[],
  scheduleBlocks: ScheduleBlock[],
): Set<string> {
  const slots =
    new Set<string>()

  bookings
    .filter(
      (booking) =>
        booking.status !==
        "cancelled",
    )
    .forEach((booking) => {
      const startMinutes =
        timeToMinutes(
          booking.booking_time,
        )

      const endMinutes =
        startMinutes +
        getServiceDuration(
          booking.service,
        )

      scheduleHours.forEach(
        (scheduleTime) => {
          const slotMinutes =
            timeToMinutes(
              scheduleTime,
            )

          if (
            slotMinutes >=
              startMinutes &&
            slotMinutes <
              endMinutes
          ) {
            slots.add(
              scheduleTime,
            )
          }
        },
      )
    })

  scheduleBlocks.forEach(
    (block) => {
      const startMinutes =
        timeToMinutes(
          block.start_time,
        )

      const endMinutes =
        timeToMinutes(
          block.end_time,
        )

      scheduleHours.forEach(
        (scheduleTime) => {
          const slotMinutes =
            timeToMinutes(
              scheduleTime,
            )

          if (
            slotMinutes >=
              startMinutes &&
            slotMinutes <
              endMinutes
          ) {
            slots.add(
              scheduleTime,
            )
          }
        },
      )
    },
  )

  return slots
}

function SchedulePage() {
  const {
    bookings,
    isLoading,
    error,
    refreshBookings,
  } = useAdminBookings()

  const {
    scheduleBlocks,
    isLoadingScheduleBlocks,
    scheduleBlocksError,
    addScheduleBlock,
    removeScheduleBlock,
  } = useScheduleBlocks()

  const [
    scheduleView,
    setScheduleView,
  ] =
    useState<ScheduleView>(
      "day",
    )

  const [
    selectedDate,
    setSelectedDate,
  ] = useState(
    () => new Date(),
  )

  const [
    selectedBooking,
    setSelectedBooking,
  ] =
    useState<AdminBooking | null>(
      null,
    )

  const [
    isEditDrawerOpen,
    setIsEditDrawerOpen,
  ] = useState(false)

  const [
    isNewBookingDrawerOpen,
    setIsNewBookingDrawerOpen,
  ] = useState(false)

  const [
    isScheduleBlockDrawerOpen,
    setIsScheduleBlockDrawerOpen,
  ] = useState(false)

  const [
    selectedAvailableTime,
    setSelectedAvailableTime,
  ] = useState("10:00")

  const selectedDateValue =
    useMemo(
      () =>
        formatDateForInput(
          selectedDate,
        ),
      [selectedDate],
    )

  const formattedSelectedDate =
    useMemo(
      () =>
        formatSelectedDate(
          selectedDate,
        ),
      [selectedDate],
    )

  const weekDays =
    useMemo(
      () =>
        getWeekDays(
          selectedDate,
        ),
      [selectedDate],
    )

  const formattedWeekRange =
    useMemo(
      () =>
        formatWeekRange(
          weekDays,
        ),
      [weekDays],
    )

  const dayBookings =
    useMemo(() => {
      return bookings
        .filter(
          (booking) =>
            booking.booking_date ===
            selectedDateValue,
        )
        .sort(
          (
            firstBooking,
            secondBooking,
          ) =>
            firstBooking.booking_time.localeCompare(
              secondBooking.booking_time,
            ),
        )
    }, [
      bookings,
      selectedDateValue,
    ])

  const dayScheduleBlocks =
    useMemo(() => {
      return scheduleBlocks
        .filter(
          (block) =>
            block.block_date ===
            selectedDateValue,
        )
        .sort(
          (
            firstBlock,
            secondBlock,
          ) =>
            firstBlock.start_time.localeCompare(
              secondBlock.start_time,
            ),
        )
    }, [
      scheduleBlocks,
      selectedDateValue,
    ])

  const activeDayBookings =
    useMemo(() => {
      return dayBookings.filter(
        (booking) =>
          booking.status !==
          "cancelled",
      )
    }, [dayBookings])

  const confirmedBookings =
    dayBookings.filter(
      (booking) =>
        booking.status ===
        "confirmed",
    ).length

  const pendingBookings =
    dayBookings.filter(
      (booking) =>
        booking.status ===
        "pending",
    ).length

  const occupiedSlots =
    useMemo(
      () =>
        getOccupiedSlots(
          dayBookings,
          dayScheduleBlocks,
        ),
      [
        dayBookings,
        dayScheduleBlocks,
      ],
    )

  const availableSlots =
    Math.max(
      0,
      scheduleHours.length -
        occupiedSlots.size,
    )

  const weekBookings =
    useMemo(() => {
      const firstDate =
        formatDateForInput(
          weekDays[0],
        )

      const lastDate =
        formatDateForInput(
          weekDays[
            weekDays.length - 1
          ],
        )

      return bookings.filter(
        (booking) =>
          booking.booking_date >=
            firstDate &&
          booking.booking_date <=
            lastDate,
      )
    }, [
      bookings,
      weekDays,
    ])

  

  const weekConfirmedBookings =
    weekBookings.filter(
      (booking) =>
        booking.status ===
        "confirmed",
    ).length

  const weekPendingBookings =
    weekBookings.filter(
      (booking) =>
        booking.status ===
        "pending",
    ).length

  const weekAvailableSlots =
    useMemo(() => {
      return weekDays.reduce(
        (
          totalAvailable,
          date,
        ) => {
          const dateValue =
            formatDateForInput(
              date,
            )

          const dateBookings =
            bookings.filter(
              (booking) =>
                booking.booking_date ===
                dateValue,
            )

          const dateBlocks =
            scheduleBlocks.filter(
              (block) =>
                block.block_date ===
                dateValue,
            )

          const dateOccupiedSlots =
            getOccupiedSlots(
              dateBookings,
              dateBlocks,
            )

          return (
            totalAvailable +
            Math.max(
              0,
              scheduleHours.length -
                dateOccupiedSlots.size,
            )
          )
        },
        0,
      )
    }, [
      bookings,
      scheduleBlocks,
      weekDays,
    ])

  function changePeriod(
    amount: number,
  ) {
    const daysToChange =
      scheduleView === "week"
        ? amount * 7
        : amount

    setSelectedDate(
      (currentDate) => {
        const nextDate =
          new Date(currentDate)

        nextDate.setDate(
          nextDate.getDate() +
            daysToChange,
        )

        return nextDate
      },
    )
  }

  function goToToday() {
    setSelectedDate(
      new Date(),
    )
  }

  function handleDateChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    const [
      year,
      month,
      day,
    ] = event.target.value
      .split("-")
      .map(Number)

    if (
      !year ||
      !month ||
      !day
    ) {
      return
    }

    setSelectedDate(
      new Date(
        year,
        month - 1,
        day,
      ),
    )
  }

  function getStartingBooking(
    time: string,
  ): AdminBooking | undefined {
    return activeDayBookings.find(
      (booking) =>
        formatBookingTime(
          booking.booking_time,
        ) === time,
    )
  }

  function getOccupyingBooking(
    time: string,
  ): AdminBooking | undefined {
    const slotMinutes =
      timeToMinutes(time)

    return activeDayBookings.find(
      (booking) => {
        const startMinutes =
          timeToMinutes(
            booking.booking_time,
          )

        const endMinutes =
          startMinutes +
          getServiceDuration(
            booking.service,
          )

        return (
          slotMinutes >
            startMinutes &&
          slotMinutes <
            endMinutes
        )
      },
    )
  }

  function getStartingBlock(
    time: string,
  ): ScheduleBlock | undefined {
    return dayScheduleBlocks.find(
      (block) =>
        formatBookingTime(
          block.start_time,
        ) === time,
    )
  }

  function getOccupyingBlock(
    time: string,
  ): ScheduleBlock | undefined {
    const slotMinutes =
      timeToMinutes(time)

    return dayScheduleBlocks.find(
      (block) => {
        const startMinutes =
          timeToMinutes(
            block.start_time,
          )

        const endMinutes =
          timeToMinutes(
            block.end_time,
          )

        return (
          slotMinutes >
            startMinutes &&
          slotMinutes <
            endMinutes
        )
      },
    )
  }

  function getBookingsForDate(
    date: Date,
  ): AdminBooking[] {
    const dateValue =
      formatDateForInput(date)

    return bookings
      .filter(
        (booking) =>
          booking.booking_date ===
          dateValue,
      )
      .sort(
        (
          firstBooking,
          secondBooking,
        ) =>
          firstBooking.booking_time.localeCompare(
            secondBooking.booking_time,
          ),
      )
  }

  function getBlocksForDate(
    date: Date,
  ): ScheduleBlock[] {
    const dateValue =
      formatDateForInput(date)

    return scheduleBlocks
      .filter(
        (block) =>
          block.block_date ===
          dateValue,
      )
      .sort(
        (
          firstBlock,
          secondBlock,
        ) =>
          firstBlock.start_time.localeCompare(
            secondBlock.start_time,
          ),
      )
  }

  function openDayView(
    date: Date,
  ) {
    setSelectedDate(
      new Date(date),
    )

    setScheduleView(
      "day",
    )
  }

  function openEditDrawer(
    booking: AdminBooking,
  ) {
    setSelectedBooking(
      booking,
    )

    setIsEditDrawerOpen(
      true,
    )
  }

  function closeEditDrawer() {
    setIsEditDrawerOpen(
      false,
    )

    setSelectedBooking(
      null,
    )
  }

  async function handleBookingSaved() {
    await refreshBookings()
    closeEditDrawer()
  }

  function openNewBookingDrawer(
    time: string,
    date: Date = selectedDate,
  ) {
    setSelectedDate(
      new Date(date),
    )

    setSelectedAvailableTime(
      time,
    )

    setIsNewBookingDrawerOpen(
      true,
    )
  }

  function closeNewBookingDrawer() {
    setIsNewBookingDrawerOpen(
      false,
    )
  }

  async function handleNewBookingSaved() {
    await refreshBookings()
    closeNewBookingDrawer()
  }

  function openScheduleBlockDrawer(
    time: string,
    date: Date = selectedDate,
  ) {
    setSelectedDate(
      new Date(date),
    )

    setSelectedAvailableTime(
      time,
    )

    setIsScheduleBlockDrawerOpen(
      true,
    )
  }

  function closeScheduleBlockDrawer() {
    setIsScheduleBlockDrawerOpen(
      false,
    )
  }

  async function handleScheduleBlockSaved(
    block: NewScheduleBlock,
  ) {
    await addScheduleBlock(
      block,
    )

    closeScheduleBlockDrawer()
  }

  async function handleRemoveScheduleBlock(
    block: ScheduleBlock,
  ) {
    const shouldRemove =
      window.confirm(
        `Remove "${block.title}" from the schedule?`,
      )

    if (!shouldRemove) {
      return
    }

    await removeScheduleBlock(
      block.id,
    )
  }

  const summaryTotal =
    scheduleView === "week"
      ? weekBookings.length
      : dayBookings.length

  const summaryConfirmed =
    scheduleView === "week"
      ? weekConfirmedBookings
      : confirmedBookings

  const summaryPending =
    scheduleView === "week"
      ? weekPendingBookings
      : pendingBookings

  const summaryAvailable =
    scheduleView === "week"
      ? weekAvailableSlots
      : availableSlots

  const pageIsLoading =
    isLoading ||
    isLoadingScheduleBlocks

  return (
    <>
      <section className="schedule-page">
        <header className="schedule-page__header">
          <div>
            <span className="schedule-page__eyebrow">
              OPERATIONS
            </span>

            <h1>Schedule</h1>

            <p>
              Manage appointments,
              availability and blocked
              times.
            </p>
          </div>

          <div className="schedule-page__header-actions">
            <button
              className="schedule-page__block-time"
              type="button"
              onClick={() => {
                openScheduleBlockDrawer(
                  "12:00",
                )
              }}
            >
              Block time
            </button>

            <button
              className="schedule-page__new-booking"
              type="button"
              onClick={() => {
                openNewBookingDrawer(
                  "10:00",
                )
              }}
            >
              + New booking
            </button>
          </div>
        </header>

        <div className="schedule-view-switcher">
          <button
            className={
              scheduleView === "day"
                ? "schedule-view-switcher__button schedule-view-switcher__button--active"
                : "schedule-view-switcher__button"
            }
            type="button"
            onClick={() => {
              setScheduleView(
                "day",
              )
            }}
          >
            Day
          </button>

          <button
            className={
              scheduleView === "week"
                ? "schedule-view-switcher__button schedule-view-switcher__button--active"
                : "schedule-view-switcher__button"
            }
            type="button"
            onClick={() => {
              setScheduleView(
                "week",
              )
            }}
          >
            Week
          </button>
        </div>

        <div className="schedule-summary">
          <article className="schedule-summary__card">
            <span>
              Total bookings
            </span>

            <strong>
              {summaryTotal}
            </strong>
          </article>

          <article className="schedule-summary__card">
            <span>
              Confirmed
            </span>

            <strong>
              {summaryConfirmed}
            </strong>
          </article>

          <article className="schedule-summary__card">
            <span>
              Pending
            </span>

            <strong>
              {summaryPending}
            </strong>
          </article>

          <article className="schedule-summary__card">
            <span>
              Available slots
            </span>

            <strong>
              {summaryAvailable}
            </strong>
          </article>
        </div>

        <div className="schedule-toolbar">
          <div className="schedule-toolbar__navigation">
            <button
              type="button"
              aria-label={
                scheduleView === "week"
                  ? "Previous week"
                  : "Previous day"
              }
              onClick={() => {
                changePeriod(-1)
              }}
            >
              ‹
            </button>

            <button
              className="schedule-toolbar__today"
              type="button"
              onClick={goToToday}
            >
              Today
            </button>

            <button
              type="button"
              aria-label={
                scheduleView === "week"
                  ? "Next week"
                  : "Next day"
              }
              onClick={() => {
                changePeriod(1)
              }}
            >
              ›
            </button>
          </div>

          <div className="schedule-toolbar__date">
            <div>
              <span>
                {scheduleView ===
                "week"
                  ? "Selected week"
                  : "Selected day"}
              </span>

              <strong>
                {scheduleView ===
                "week"
                  ? formattedWeekRange
                  : formattedSelectedDate}
              </strong>
            </div>

            <input
              type="date"
              value={
                selectedDateValue
              }
              onChange={
                handleDateChange
              }
              aria-label="Select schedule date"
            />
          </div>
        </div>

        {(error ||
          scheduleBlocksError) && (
          <div className="schedule-page__error">
            {error ||
              scheduleBlocksError}
          </div>
        )}

        {scheduleView ===
        "week" ? (
          <main className="schedule-week">
            <div className="schedule-week__heading">
              <div>
                <h2>
                  Weekly schedule
                </h2>

                <p>
                  {formattedWeekRange}
                </p>
              </div>

              <div className="schedule-calendar__legend">
                <span>
                  <i className="schedule-legend schedule-legend--available" />
                  Available
                </span>

                <span>
                  <i className="schedule-legend schedule-legend--pending" />
                  Pending
                </span>

                <span>
                  <i className="schedule-legend schedule-legend--confirmed" />
                  Confirmed
                </span>

                <span>
                  <i className="schedule-legend schedule-legend--blocked" />
                  Blocked
                </span>
              </div>
            </div>

            {pageIsLoading ? (
              <div className="schedule-empty">
                <strong>
                  Loading schedule...
                </strong>
              </div>
            ) : (
              <div className="schedule-week__grid">
                {weekDays.map(
                  (date) => {
                    const dateValue =
                      formatDateForInput(
                        date,
                      )

                    const dateBookings =
                      getBookingsForDate(
                        date,
                      )

                    const dateBlocks =
                      getBlocksForDate(
                        date,
                      )

                    const dateOccupiedSlots =
                      getOccupiedSlots(
                        dateBookings,
                        dateBlocks,
                      )

                    const dateAvailableSlots =
                      Math.max(
                        0,
                        scheduleHours.length -
                          dateOccupiedSlots.size,
                      )

                    const isToday =
                      isSameDate(
                        date,
                        new Date(),
                      )

                    const isSelected =
                      isSameDate(
                        date,
                        selectedDate,
                      )

                    return (
                      <article
                        className={`schedule-week-day${
                          isToday
                            ? " schedule-week-day--today"
                            : ""
                        }${
                          isSelected
                            ? " schedule-week-day--selected"
                            : ""
                        }`}
                        key={
                          dateValue
                        }
                      >
                        <button
                          className="schedule-week-day__header"
                          type="button"
                          onClick={() => {
                            openDayView(
                              date,
                            )
                          }}
                        >
                          <span>
                            {formatWeekDayName(
                              date,
                            )}
                          </span>

                          <strong>
                            {formatWeekDayNumber(
                              date,
                            )}
                          </strong>

                          <small>
                            {formatWeekDayMonth(
                              date,
                            )}
                          </small>
                        </button>

                        <div className="schedule-week-day__summary">
                          <span>
                            {
                              dateBookings.length
                            }
                            {
                              " bookings"
                            }
                          </span>

                          <small>
                            {
                              dateAvailableSlots
                            }
                            {
                              " slots available"
                            }
                          </small>
                        </div>

                        <div className="schedule-week-day__bookings">
                          {dateBookings.map(
                            (
                              booking,
                            ) => (
                              <button
                                className={`schedule-week-booking schedule-week-booking--${booking.status}`}
                                key={
                                  booking.id
                                }
                                type="button"
                                onClick={() => {
                                  openEditDrawer(
                                    booking,
                                  )
                                }}
                              >
                                <time>
                                  {formatBookingTime(
                                    booking.booking_time,
                                  )}
                                </time>

                                <strong>
                                  {getCustomerName(
                                    booking,
                                  )}
                                </strong>

                                <span>
                                  {getServiceName(
                                    booking.service,
                                  )}
                                </span>

                                <small>
                                  {
                                    booking.status
                                  }
                                </small>
                              </button>
                            ),
                          )}

                          {dateBlocks.map(
                            (block) => (
                              <button
                                className={`schedule-week-block schedule-week-block--${block.block_type}`}
                                key={
                                  block.id
                                }
                                type="button"
                                title="Click to remove block"
                                onClick={() => {
                                  void handleRemoveScheduleBlock(
                                    block,
                                  )
                                }}
                              >
                                <time>
                                  {formatBookingTime(
                                    block.start_time,
                                  )}
                                  {"–"}
                                  {formatBookingTime(
                                    block.end_time,
                                  )}
                                </time>

                                <strong>
                                  {
                                    block.title
                                  }
                                </strong>

                                <span>
                                  {
                                    block.block_type
                                  }
                                </span>
                              </button>
                            ),
                          )}

                          {dateBookings.length ===
                            0 &&
                            dateBlocks.length ===
                              0 && (
                              <button
                                className="schedule-week-day__empty"
                                type="button"
                                onClick={() => {
                                  openNewBookingDrawer(
                                    "10:00",
                                    date,
                                  )
                                }}
                              >
                                <strong>
                                  Available
                                </strong>

                                <span>
                                  Create booking
                                </span>
                              </button>
                            )}
                        </div>

                        <div className="schedule-week-day__actions">
                          <button
                            type="button"
                            onClick={() => {
                              openScheduleBlockDrawer(
                                "12:00",
                                date,
                              )
                            }}
                          >
                            Block
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              openNewBookingDrawer(
                                "10:00",
                                date,
                              )
                            }}
                          >
                            + Booking
                          </button>
                        </div>
                      </article>
                    )
                  },
                )}
              </div>
            )}
          </main>
        ) : (
          <div className="schedule-content">
            <main className="schedule-calendar">
              <div className="schedule-calendar__heading">
                <div>
                  <h2>
                    Daily schedule
                  </h2>

                  <p>
                    {formattedSelectedDate}
                  </p>
                </div>

                <div className="schedule-calendar__legend">
                  <span>
                    <i className="schedule-legend schedule-legend--available" />
                    Available
                  </span>

                  <span>
                    <i className="schedule-legend schedule-legend--pending" />
                    Pending
                  </span>

                  <span>
                    <i className="schedule-legend schedule-legend--confirmed" />
                    Confirmed
                  </span>

                  <span>
                    <i className="schedule-legend schedule-legend--blocked" />
                    Blocked
                  </span>
                </div>
              </div>

              {pageIsLoading ? (
                <div className="schedule-empty">
                  <strong>
                    Loading schedule...
                  </strong>
                </div>
              ) : (
                <div className="schedule-timeline">
                  {scheduleHours.map(
                    (time) => {
                      const booking =
                        getStartingBooking(
                          time,
                        )

                      const occupyingBooking =
                        getOccupyingBooking(
                          time,
                        )

                      const block =
                        getStartingBlock(
                          time,
                        )

                      const occupyingBlock =
                        getOccupyingBlock(
                          time,
                        )

                      return (
                        <div
                          className="schedule-time-row"
                          key={time}
                        >
                          <time>
                            {time}
                          </time>

                          {booking ? (
                            <button
                              className={`schedule-booking schedule-booking--${booking.status}`}
                              style={{
                                height:
                                  getBookingHeight(
                                    booking,
                                  ),
                              }}
                              type="button"
                              onClick={() => {
                                openEditDrawer(
                                  booking,
                                )
                              }}
                            >
                              <div className="schedule-booking__content">
                                <div>
                                  <strong>
                                    {getCustomerName(
                                      booking,
                                    )}
                                  </strong>

                                  <span>
                                    {getServiceName(
                                      booking.service,
                                    )}
                                  </span>

                                  <small>
                                    {
                                      booking.vehicle
                                    }
                                    {booking.model
                                      ? ` ${booking.model}`
                                      : ""}
                                  </small>
                                </div>

                                <div className="schedule-booking__details">
                                  <span>
                                    {booking.license_plate ||
                                      "No plate"}
                                  </span>

                                  <small>
                                    {
                                      booking.phone
                                    }
                                  </small>
                                </div>
                              </div>

                              <div className="schedule-booking__time">
                                {formatBookingTime(
                                  booking.booking_time,
                                )}
                                {"–"}
                                {getBookingEndTime(
                                  booking,
                                )}
                              </div>
                            </button>
                          ) : block ? (
                            <button
                              className={`schedule-block schedule-block--${block.block_type}`}
                              style={{
                                height:
                                  getScheduleBlockHeight(
                                    block,
                                  ),
                              }}
                              type="button"
                              title="Click to remove block"
                              onClick={() => {
                                void handleRemoveScheduleBlock(
                                  block,
                                )
                              }}
                            >
                              <div>
                                <strong>
                                  {
                                    block.title
                                  }
                                </strong>

                                <span>
                                  {
                                    block.block_type
                                  }
                                </span>

                                {block.reason && (
                                  <small>
                                    {
                                      block.reason
                                    }
                                  </small>
                                )}
                              </div>

                              <time>
                                {formatBookingTime(
                                  block.start_time,
                                )}
                                {"–"}
                                {formatBookingTime(
                                  block.end_time,
                                )}
                              </time>
                            </button>
                          ) : occupyingBooking ||
                            occupyingBlock ? (
                            <div
                              className="schedule-slot-continuation"
                              aria-hidden="true"
                            />
                          ) : (
                            <div className="schedule-slot-actions">
                              <button
                                className="schedule-slot"
                                type="button"
                                onClick={() => {
                                  openNewBookingDrawer(
                                    time,
                                  )
                                }}
                              >
                                <span>
                                  Available
                                </span>

                                <small>
                                  Create booking
                                </small>
                              </button>

                              <button
                                className="schedule-slot-block"
                                type="button"
                                onClick={() => {
                                  openScheduleBlockDrawer(
                                    time,
                                  )
                                }}
                              >
                                Block
                              </button>
                            </div>
                          )}
                        </div>
                      )
                    },
                  )}
                </div>
              )}
            </main>

            <aside className="schedule-sidebar">
              <div className="schedule-sidebar__heading">
                <h2>
                  Day overview
                </h2>

                <span>
                  {dayBookings.length}
                  {" appointments"}
                </span>
              </div>

              {dayScheduleBlocks.length >
                0 && (
                <div className="schedule-sidebar__blocks">
                  <strong>
                    Blocked times
                  </strong>

                  {dayScheduleBlocks.map(
                    (block) => (
                      <button
                        key={
                          block.id
                        }
                        type="button"
                        onClick={() => {
                          void handleRemoveScheduleBlock(
                            block,
                          )
                        }}
                      >
                        <div>
                          <strong>
                            {
                              block.title
                            }
                          </strong>

                          <small>
                            {
                              block.block_type
                            }
                          </small>
                        </div>

                        <time>
                          {formatBookingTime(
                            block.start_time,
                          )}
                          {"–"}
                          {formatBookingTime(
                            block.end_time,
                          )}
                        </time>
                      </button>
                    ),
                  )}
                </div>
              )}

              <div className="schedule-capacity">
                <div className="schedule-capacity__heading">
                  <strong>
                    Daily capacity
                  </strong>

                  <span>
                    {
                      occupiedSlots.size
                    }
                    /
                    {
                      scheduleHours.length
                    }
                  </span>
                </div>

                <div className="schedule-capacity__bar">
                  <span
                    style={{
                      width: `${
                        (occupiedSlots.size /
                          scheduleHours.length) *
                        100
                      }%`,
                    }}
                  />
                </div>

                <p>
                  Capacity includes
                  bookings and blocked
                  times.
                </p>
              </div>
            </aside>
          </div>
        )}
      </section>

      <EditBookingDrawer
        booking={selectedBooking}
        isOpen={isEditDrawerOpen}
        onClose={
          closeEditDrawer
        }
        onSaved={
          handleBookingSaved
        }
      />

      <NewBookingDrawer
        isOpen={
          isNewBookingDrawerOpen
        }
        initialDate={
          selectedDateValue
        }
        initialTime={
          selectedAvailableTime
        }
        bookings={bookings}
        onClose={
          closeNewBookingDrawer
        }
        onSaved={
          handleNewBookingSaved
        }
      />

      <ScheduleBlockDrawer
        isOpen={
          isScheduleBlockDrawerOpen
        }
        initialDate={
          selectedDateValue
        }
        initialStartTime={
          selectedAvailableTime
        }
        onClose={
          closeScheduleBlockDrawer
        }
        onSave={
          handleScheduleBlockSaved
        }
      />
    </>
  )
}

export default SchedulePage