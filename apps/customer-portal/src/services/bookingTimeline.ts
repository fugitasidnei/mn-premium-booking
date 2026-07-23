import { supabase } from "./supabase"

import type {
  BookingTimelineEvent,
  BookingTimelineEventType,
  CreateBookingTimelineEvent,
} from "../types/bookingTimeline"

const BOOKING_TIMELINE_TABLE =
  "booking_timeline"

interface RegisterBookingChangeOptions {
  bookingId: string
  eventType: BookingTimelineEventType
  title: string
  description?: string | null
  oldValue?: unknown
  newValue?: unknown
}

function normalizeTimelineValue(
  value: unknown,
): string | null {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null
  }

  return String(value)
}

export async function getBookingTimeline(
  bookingId: string,
): Promise<BookingTimelineEvent[]> {
  const { data, error } = await supabase
    .from(BOOKING_TIMELINE_TABLE)
    .select("*")
    .eq("booking_id", bookingId)
    .order("created_at", {
      ascending: false,
    })

  if (error) {
    console.error(
      "Error loading booking timeline:",
      error,
    )

    throw new Error(
      error.message ||
        "Could not load the booking timeline.",
    )
  }

  return (
    data ?? []
  ) as BookingTimelineEvent[]
}

export async function createBookingTimelineEvent(
  event: CreateBookingTimelineEvent,
): Promise<BookingTimelineEvent> {
  const { data, error } = await supabase
    .from(BOOKING_TIMELINE_TABLE)
    .insert({
      booking_id: event.booking_id,
      event_type: event.event_type,
      title: event.title,
      description:
        event.description ?? null,
      old_value:
        event.old_value ?? null,
      new_value:
        event.new_value ?? null,
      created_by:
        event.created_by ?? "admin",
    })
    .select("*")
    .single()

  if (error) {
    console.error(
      "Error creating booking timeline event:",
      error,
    )

    throw new Error(
      error.message ||
        "Could not save the timeline event.",
    )
  }

  return data as BookingTimelineEvent
}

export async function registerBookingChange({
  bookingId,
  eventType,
  title,
  description = null,
  oldValue,
  newValue,
}: RegisterBookingChangeOptions): Promise<BookingTimelineEvent> {
  return createBookingTimelineEvent({
    booking_id: bookingId,
    event_type: eventType,
    title,
    description,
    old_value:
      normalizeTimelineValue(
        oldValue,
      ),
    new_value:
      normalizeTimelineValue(
        newValue,
      ),
  })
}

export async function registerBookingCreated(
  bookingId: string,
): Promise<BookingTimelineEvent> {
  return createBookingTimelineEvent({
    booking_id: bookingId,
    event_type: "booking_created",
    title: "Booking created",
    description:
      "The booking was created.",
  })
}

export async function registerBookingUpdated(
  bookingId: string,
  description: string,
  oldValue?: string | null,
  newValue?: string | null,
): Promise<BookingTimelineEvent> {
  return createBookingTimelineEvent({
    booking_id: bookingId,
    event_type: "booking_updated",
    title: "Booking updated",
    description,
    old_value: oldValue ?? null,
    new_value: newValue ?? null,
  })
}

export async function registerBookingConfirmed(
  bookingId: string,
  previousStatus?: string,
): Promise<BookingTimelineEvent> {
  return createBookingTimelineEvent({
    booking_id: bookingId,
    event_type: "booking_confirmed",
    title: "Booking confirmed",
    description:
      "The booking status was changed to confirmed.",
    old_value:
      previousStatus ?? "pending",
    new_value: "confirmed",
  })
}

export async function registerBookingCancelled(
  bookingId: string,
  previousStatus?: string,
): Promise<BookingTimelineEvent> {
  return createBookingTimelineEvent({
    booking_id: bookingId,
    event_type: "booking_cancelled",
    title: "Booking cancelled",
    description:
      "The booking status was changed to cancelled.",
    old_value:
      previousStatus ?? "pending",
    new_value: "cancelled",
  })
}