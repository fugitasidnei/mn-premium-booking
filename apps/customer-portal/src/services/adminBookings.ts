import { supabase } from "./supabase"

import type {
  AdminBooking,
  BookingStatus,
  UpdateAdminBooking,
} from "../types/adminBooking"

const BOOKINGS_TABLE = "bookings"

export async function getAdminBookings(): Promise<
  AdminBooking[]
> {
  const { data, error } = await supabase
    .from(BOOKINGS_TABLE)
    .select("*")
    .order("booking_date", {
      ascending: true,
    })
    .order("booking_time", {
      ascending: true,
    })

  if (error) {
    console.error(
      "Error loading admin bookings:",
      error,
    )

    throw new Error(
      "Could not load the bookings.",
    )
  }

  return (data ?? []) as AdminBooking[]
}

export async function getAdminBookingById(
  bookingId: string,
): Promise<AdminBooking> {
  const { data, error } = await supabase
    .from(BOOKINGS_TABLE)
    .select("*")
    .eq("id", bookingId)
    .single()

  if (error) {
    console.error(
      "Error loading booking:",
      error,
    )

    throw new Error(
      "Could not load this booking.",
    )
  }

  return data as AdminBooking
}

export async function updateAdminBooking(
  bookingId: string,
  updates: UpdateAdminBooking,
): Promise<AdminBooking> {
  const { data, error } = await supabase
    .from(BOOKINGS_TABLE)
    .update(updates)
    .eq("id", bookingId)
    .select("*")
    .single()

  if (error) {
    console.error(
      "Error updating booking:",
      error,
    )

    throw new Error(
      "Could not update the booking.",
    )
  }

  return data as AdminBooking
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
): Promise<AdminBooking> {
  return updateAdminBooking(bookingId, {
    status,
  })
}

export async function confirmAdminBooking(
  bookingId: string,
): Promise<AdminBooking> {
  return updateBookingStatus(
    bookingId,
    "confirmed",
  )
}

export async function cancelAdminBooking(
  bookingId: string,
): Promise<AdminBooking> {
  return updateBookingStatus(
    bookingId,
    "cancelled",
  )
}

export async function deleteAdminBooking(
  bookingId: string,
): Promise<void> {
  const { error } = await supabase
    .from(BOOKINGS_TABLE)
    .delete()
    .eq("id", bookingId)

  if (error) {
    console.error(
      "Error deleting booking:",
      error,
    )

    throw new Error(
      "Could not delete the booking.",
    )
  }
}