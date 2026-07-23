import type {
  AdminBooking,
} from "../../../types/adminBooking"

export type CustomerStatus =
  | "active"
  | "inactive"

export type CustomerLevel =
  | "standard"
  | "returning"
  | "vip"

export interface AdminCustomer {
  id: string
  firstName: string
  lastName: string
  phone: string
  email: string
  vehicles: string[]
  licensePlates: string[]
  bookingsCount: number
  confirmedBookingsCount: number
  cancelledBookingsCount: number
  totalSpent: number
  averageTicket: number
  lastVisitDate: string | null
  nextBookingDate: string | null
  customerSince: string
  status: CustomerStatus
  level: CustomerLevel
  bookings: AdminBooking[]
}