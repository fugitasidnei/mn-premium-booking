import { supabase } from "./supabase"

import {
  registerBookingCancelled,
  registerBookingConfirmed,
  registerBookingCreated,
  registerBookingUpdated,
} from "./bookingTimeline"

import type {
  AdminBooking,
  BookingStatus,
  CreateAdminBooking,
  UpdateAdminBooking,
} from "../types/adminBooking"

const BOOKINGS_TABLE = "bookings"

async function safelyRegisterTimeline(
  action: () => Promise<unknown>,
): Promise<void> {
  try {
    await action()
  } catch (error) {
    console.error(
      "The booking was saved, but the timeline event could not be registered:",
      error,
    )
  }
}

function getChangedFields(
  currentBooking: AdminBooking,
  updates: UpdateAdminBooking,
): string[] {
  const currentValues =
    currentBooking as unknown as Record<
      string,
      unknown
    >

  const updateValues =
    updates as unknown as Record<
      string,
      unknown
    >

  return Object.keys(updateValues).filter(
    (field) =>
      currentValues[field] !==
      updateValues[field],
  )
}

function formatFieldName(field: string): string {
  return field
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    )
}

async function updateBookingStatusDirectly(
  bookingId: string,
  status: BookingStatus,
): Promise<AdminBooking> {
  const { data, error } = await supabase
    .from(BOOKINGS_TABLE)
    .update({
      status,
    })
    .eq("id", bookingId)
    .select("*")
    .single()

  if (error) {
    console.error(
      "Error updating booking status:",
      error,
    )

    throw new Error(
      error.message ||
        "Could not update the booking status.",
    )
  }

  return data as AdminBooking
}

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

export async function createAdminBooking(
  booking: CreateAdminBooking,
): Promise<AdminBooking> {
  const { data, error } = await supabase
    .from(BOOKINGS_TABLE)
    .insert(booking)
    .select("*")
    .single()

  if (error) {
    console.error(
      "Error creating booking:",
      error,
    )

    throw new Error(
      error.message ||
        "Could not create the booking.",
    )
  }

  const createdBooking = data as AdminBooking

  await safelyRegisterTimeline(() =>
    registerBookingCreated(
      createdBooking.id,
    ),
  )

  return createdBooking
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
  const currentBooking =
    await getAdminBookingById(bookingId)

  const changedFields = getChangedFields(
    currentBooking,
    updates,
  )

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
      error.message ||
        "Could not update the booking.",
    )
  }

  const updatedBooking = data as AdminBooking

  if (changedFields.length > 0) {
    const formattedFields = changedFields
      .map(formatFieldName)
      .join(", ")

    await safelyRegisterTimeline(() =>
      registerBookingUpdated(
        bookingId,
        `Updated fields: ${formattedFields}.`,
      ),
    )
  }

  return updatedBooking
}

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus,
): Promise<AdminBooking> {
  const currentBooking =
    await getAdminBookingById(bookingId)

  const updatedBooking =
    await updateBookingStatusDirectly(
      bookingId,
      status,
    )

  if (currentBooking.status !== status) {
    await safelyRegisterTimeline(() =>
      registerBookingUpdated(
        bookingId,
        `Booking status changed from ${currentBooking.status} to ${status}.`,
        currentBooking.status,
        status,
      ),
    )
  }

  return updatedBooking
}

export async function confirmAdminBooking(
  bookingId: string,
): Promise<AdminBooking> {
  const currentBooking =
    await getAdminBookingById(bookingId)

  const updatedBooking =
    await updateBookingStatusDirectly(
      bookingId,
      "confirmed",
    )

  if (
    currentBooking.status !== "confirmed"
  ) {
    await safelyRegisterTimeline(() =>
      registerBookingConfirmed(
        bookingId,
      ),
    )
  }

  return updatedBooking
}

export async function cancelAdminBooking(
  bookingId: string,
): Promise<AdminBooking> {
  const currentBooking =
    await getAdminBookingById(bookingId)

  const updatedBooking =
    await updateBookingStatusDirectly(
      bookingId,
      "cancelled",
    )

  if (
    currentBooking.status !== "cancelled"
  ) {
    await safelyRegisterTimeline(() =>
      registerBookingCancelled(
        bookingId,
        currentBooking.status,
      ),
    )
  }

  return updatedBooking
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
      error.message ||
        "Could not delete the booking.",
    )
  }
}