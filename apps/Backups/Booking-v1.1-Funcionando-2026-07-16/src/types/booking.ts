export type ServiceId = "exterior-wash" | "premium-finish"

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "waiting-list"

export interface BookingService {
  id: ServiceId
  name: string
  durationMinutes: number
}

export interface TimeSlot {
  startTime: string
  endTime: string
  available: boolean
  reason?: string
}

export interface Booking {
  id: string
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceId: ServiceId
  date: string
  startTime: string
  endTime: string
  status: BookingStatus
  createdAt: string
}

export interface BookingFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceId: ServiceId | ""
  date: string
  startTime: string
}

export interface DailyBookingCapacity {
  exteriorWashCount: number
  premiumFinishCount: number
  totalMinutesBooked: number
  availableMinutes: number
}