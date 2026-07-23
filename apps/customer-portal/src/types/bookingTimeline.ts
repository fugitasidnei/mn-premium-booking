export type BookingTimelineEventType =
  | "booking_created"
  | "booking_updated"
  | "customer_updated"
  | "vehicle_updated"
  | "service_updated"
  | "schedule_updated"
  | "price_updated"
  | "status_updated"
  | "booking_confirmed"
  | "booking_cancelled"
  | "booking_completed"
  | "note_added"
  | "photo_uploaded"
  | "payment_created"
  | "custom"

export interface BookingTimelineEvent {
  id: string
  booking_id: string
  event_type: BookingTimelineEventType
  title: string
  description: string | null
  old_value: string | null
  new_value: string | null
  created_by: string
  created_at: string
}

export interface CreateBookingTimelineEvent {
  booking_id: string
  event_type: BookingTimelineEventType
  title: string
  description?: string | null
  old_value?: string | null
  new_value?: string | null
  created_by?: string
}