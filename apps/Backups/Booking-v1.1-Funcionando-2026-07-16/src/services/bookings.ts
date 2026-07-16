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
    console.error("Error loading booked times:", error)
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
): Promise<void> {
  const { error } = await supabase
    .from("bookings")
    .insert({
      service: booking.service,
      plate_type: booking.plateType,
      booking_date: booking.bookingDate,
      booking_time: booking.bookingTime,
      first_name: booking.firstName,
      last_name: booking.lastName,
      phone: booking.phone,
      email: booking.email,
      vehicle: booking.vehicle || null,
      model: booking.model || null,
      license_plate: booking.licensePlate || null,
      notes: booking.notes || null,
      price: booking.price,
      status: "pending",
    })

  if (!error) {
    return
  }

  if (error.code === "23505") {
    throw new Error(
      "This appointment time was just booked. Please select another time.",
    )
  }

  console.error("Error creating booking:", error)

  throw new Error(
    "Could not save the booking. Please try again.",
  )
}