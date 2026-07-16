import type {
  BookingDayResult,
  BookingReservation,
  BookingService,
  DailyCapacity,
  ServiceType,
} from "./bookingTypes"

export const BOOKING_SERVICES: Record<ServiceType, BookingService> = {
  exterior: {
    id: "exterior",
    name: "Exterior Wash",
    durationMinutes: 90,
  },

  premium: {
    id: "premium",
    name: "Premium Finish",
    durationMinutes: 150,
  },
}

export const BOOKING_CONFIG = {
  openingTime: "10:00",

  minimumLunchMinutes: 30,

  preferredLunchMinutes: 60,

  maximumExteriorPerDay: 4,

  maximumPremiumPerDay: 3,

  maximumServicesPerDay: 4,

  /*
   * O término do dia é flexível.
   *
   * Exemplos:
   * 4 Exterior Wash = 6 horas de serviço.
   * 3 Premium Finish = 7 horas e 30 minutos.
   * 2 Exterior + 2 Premium = 8 horas.
   *
   * O almoço é acrescentado ao tempo total.
   */
  maximumWorkMinutesPerDay: 480,
}

export function getServiceDuration(serviceType: ServiceType): number {
  return BOOKING_SERVICES[serviceType].durationMinutes
}

export function getDailyCapacity(
  reservations: BookingReservation[],
): DailyCapacity {
  const activeReservations = reservations.filter(
    (reservation) =>
      reservation.status === "pending" ||
      reservation.status === "confirmed",
  )

  const exterior = activeReservations.filter(
    (reservation) => reservation.serviceType === "exterior",
  ).length

  const premium = activeReservations.filter(
    (reservation) => reservation.serviceType === "premium",
  ).length

  const totalWorkMinutes = activeReservations.reduce(
    (total, reservation) =>
      total + getServiceDuration(reservation.serviceType),
    0,
  )

  return {
    exterior,
    premium,
    totalServices: activeReservations.length,
    totalWorkMinutes,
  }
}

export function canAddReservation(
  reservations: BookingReservation[],
  requestedService: ServiceType,
): BookingDayResult {
  const currentCapacity = getDailyCapacity(reservations)
  const requestedDuration = getServiceDuration(requestedService)

  const nextCapacity: DailyCapacity = {
    exterior:
      currentCapacity.exterior +
      (requestedService === "exterior" ? 1 : 0),

    premium:
      currentCapacity.premium +
      (requestedService === "premium" ? 1 : 0),

    totalServices: currentCapacity.totalServices + 1,

    totalWorkMinutes:
      currentCapacity.totalWorkMinutes + requestedDuration,
  }

  if (
    requestedService === "exterior" &&
    nextCapacity.exterior >
      BOOKING_CONFIG.maximumExteriorPerDay
  ) {
    return {
      accepted: false,
      reason:
        "The daily limit for Exterior Wash has been reached.",
      capacity: currentCapacity,
    }
  }

  if (
    requestedService === "premium" &&
    nextCapacity.premium >
      BOOKING_CONFIG.maximumPremiumPerDay
  ) {
    return {
      accepted: false,
      reason:
        "The daily limit for Premium Finish has been reached.",
      capacity: currentCapacity,
    }
  }

  if (
    nextCapacity.totalServices >
    BOOKING_CONFIG.maximumServicesPerDay
  ) {
    return {
      accepted: false,
      reason: "The maximum number of daily bookings has been reached.",
      capacity: currentCapacity,
    }
  }

  if (
    nextCapacity.totalWorkMinutes >
    BOOKING_CONFIG.maximumWorkMinutesPerDay
  ) {
    return {
      accepted: false,
      reason:
        "There is not enough working time available for this service.",
      capacity: currentCapacity,
    }
  }

  return {
    accepted: true,
    capacity: nextCapacity,
  }
}