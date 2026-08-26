import { supabase } from "./supabase"

export interface WaitingListRequest {
  fullName: string
  phone: string
  email: string
  vehicle: string
  service: string
  preferredDate: string
  preferredTime: string
  plateType: string
}

export async function joinWaitingList(
  request: WaitingListRequest,
): Promise<void> {
  const { error } = await supabase
    .from("waiting_list")
    .insert({
      full_name: request.fullName,
      phone: request.phone,
      email: request.email,
      vehicle: request.vehicle,
      service: request.service,
      preferred_date: request.preferredDate,
      preferred_time: request.preferredTime,
      plate_type: request.plateType,
      status: "waiting",
    })

  if (error) {
    console.error(
      "Error inserting waiting list request:",
      error,
    )

    throw error
  }
}