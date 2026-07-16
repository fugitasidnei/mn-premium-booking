export type ServiceType = "exterior" | "premium"

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "waiting"

export interface BookingService {
  id: ServiceType
  name: string
  durationMinutes: number
}

export interface BookingReservation {
  id: string
  customerName: string
  serviceType: ServiceType
  startTime: string
  endTime: string
  status: BookingStatus
}

export interface DailyCapacity {
  exterior: number
  premium: number
  totalServices: number
  totalWorkMinutes: number
}

export interface BookingDayResult {
  accepted: boolean
  reason?: string
  capacity: DailyCapacity
}