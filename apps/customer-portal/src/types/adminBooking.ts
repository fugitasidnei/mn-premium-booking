export type BookingService =
  | "exterior"
  | "premium"

export type BookingPlateType =
  | "yellow"
  | "white"

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "cancelled"

export interface AdminBooking {
  id: string
  service: BookingService
  plate_type: BookingPlateType
  booking_date: string
  booking_time: string
  first_name: string
  last_name: string
  phone: string
  email: string
  vehicle: string
  model: string
  license_plate: string
  notes: string | null
  price: number
  status: BookingStatus
  created_at: string
}

export interface UpdateAdminBooking {
  service?: BookingService
  plate_type?: BookingPlateType
  booking_date?: string
  booking_time?: string
  first_name?: string
  last_name?: string
  phone?: string
  email?: string
  vehicle?: string
  model?: string
  license_plate?: string
  notes?: string | null
  price?: number
  status?: BookingStatus
}