import { supabase } from "./supabase"

export type ServiceType = "exterior" | "premium"
export type PlateType = "yellow" | "white"

export interface NewBooking {
  service: ServiceType
  plateType: PlateType
  bookingDate: string
  bookingTime: string
  firstName: string
  lastName: string
  phone: string
  email: string
  vehicle: string
  model: string
  licensePlate: string
  notes: string
  price: number
}

export async function getBookedTimes(
  selectedDate: string,
): Promise<string[]> {
  const { data, error } = await supabase.rpc(
    "get_booked_slots",
    {
      selected_date: selectedDate,
    },
  )

  if (error) {
    console.error(
      "Error loading booked times:",
      error,
    )

    throw new Error(
      "Could not load the available appointment times.",
    )
  }

  return (data ?? []).map(
    (item: { booking_time: string }) =>
      item.booking_time.slice(0, 5),
  )
}

export async function createBooking(
  booking: NewBooking,
): Promise<string> {
  const { data, error } = await supabase.rpc(
    "create_booking",
    {
      p_service: booking.service,
      p_plate_type: booking.plateType,
      p_booking_date: booking.bookingDate,
      p_booking_time: booking.bookingTime,
      p_first_name: booking.firstName,
      p_last_name: booking.lastName,
      p_phone: booking.phone,
      p_email: booking.email,
      p_vehicle: booking.vehicle,
      p_model: booking.model,
      p_license_plate: booking.licensePlate,
      p_notes: booking.notes,
      p_price: booking.price,
    },
  )

  if (!error && data) {
    return data as string
  }

  console.error(
    "Error creating booking:",
    error,
  )

  const databaseMessage =
    error?.message?.toLowerCase() ?? ""

  if (
    databaseMessage.includes("overlaps") ||
    databaseMessage.includes(
      "unique_booking_slot",
    ) ||
    error?.code === "23505"
  ) {
    throw new Error(
      "This appointment time is no longer available. Please select another time.",
    )
  }

  if (
    databaseMessage.includes("monday through friday")
  ) {
    throw new Error(
      "Appointments are available Monday through Friday.",
    )
  }

  if (
    databaseMessage.includes(
      "date cannot be in the past",
    )
  ) {
    throw new Error(
      "Please select a future appointment date.",
    )
  }

  throw new Error(
    "Could not save the booking. Please try again.",
  )
}