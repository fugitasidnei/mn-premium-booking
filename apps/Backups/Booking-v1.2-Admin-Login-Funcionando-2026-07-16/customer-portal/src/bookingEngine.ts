export type ServiceType = "simple-wash" | "premium-detail"

export type BookingBlock = {
  start: string
  end: string
}

export type AvailableSlot = {
  value: string
  start: string
  end: string
  label: string
  period: "morning" | "afternoon"
}

const SERVICE_DURATION: Record<ServiceType, number> = {
  "simple-wash": 90,
  "premium-detail": 150,
}

/*
  Horários oficiais da MN Premium Service.

  Simple Wash:
  4 horários por dia.

  Premium Detail:
  3 horários por dia.
*/
const SERVICE_START_TIMES: Record<ServiceType, string[]> = {
  "simple-wash": ["10:00", "11:30", "13:30", "15:00"],
  "premium-detail": ["10:00", "13:00", "15:30"],
}

const timeToMinutes = (time: string): number => {
  const [hours, minutes] = time.split(":").map(Number)

  return hours * 60 + minutes
}

const minutesToTime = (totalMinutes: number): string => {
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0",
  )}`
}

const formatTime = (time: string): string => {
  const [hourString, minuteString] = time.split(":")
  const hour = Number(hourString)

  const period = hour >= 12 ? "PM" : "AM"
  const displayHour = hour % 12 || 12

  return `${displayHour}:${minuteString} ${period}`
}

const blocksOverlap = (
  firstStart: number,
  firstEnd: number,
  secondStart: number,
  secondEnd: number,
): boolean => {
  return firstStart < secondEnd && firstEnd > secondStart
}

export const getAvailableSlots = (
  service: ServiceType,
  existingBookings: BookingBlock[] = [],
): AvailableSlot[] => {
  const duration = SERVICE_DURATION[service]

  return SERVICE_START_TIMES[service]
    .map((start) => {
      const startMinutes = timeToMinutes(start)
      const endMinutes = startMinutes + duration
      const end = minutesToTime(endMinutes)

      const period: "morning" | "afternoon" =
        startMinutes < 13 * 60 ? "morning" : "afternoon"

      return {
        value: start,
        start,
        end,
        period,
        label: `${formatTime(start)} - ${formatTime(end)}`,
      }
    })
    .filter((slot) => {
      const slotStart = timeToMinutes(slot.start)
      const slotEnd = timeToMinutes(slot.end)

      return !existingBookings.some((booking) => {
        const bookingStart = timeToMinutes(booking.start)
        const bookingEnd = timeToMinutes(booking.end)

        return blocksOverlap(
          slotStart,
          slotEnd,
          bookingStart,
          bookingEnd,
        )
      })
    })
}

export const getServiceDuration = (
  service: ServiceType,
): number => {
  return SERVICE_DURATION[service]
}