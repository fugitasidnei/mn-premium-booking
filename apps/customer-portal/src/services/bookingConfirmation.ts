import { supabase } from "./supabase"

export type BookingConfirmationCode =
  | "booking_confirmed"
  | "already_confirmed"
  | "booking_cancelled"
  | "already_cancelled"
  | "booking_not_found"
  | "confirmation_expired"
  | "booking_already_confirmed"
  | "unknown_error"

export interface BookingConfirmationResult {
  success: boolean
  code: BookingConfirmationCode
  message: string
  booking_id?: string
}

function normalizeResult(
  value: unknown,
): BookingConfirmationResult {
  if (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    "code" in value &&
    "message" in value
  ) {
    const result = value as {
      success: unknown
      code: unknown
      message: unknown
      booking_id?: unknown
    }

    return {
      success: Boolean(result.success),
      code:
        typeof result.code === "string"
          ? (result.code as BookingConfirmationCode)
          : "unknown_error",
      message:
        typeof result.message === "string"
          ? result.message
          : "An unexpected error occurred.",
      booking_id:
        typeof result.booking_id === "string"
          ? result.booking_id
          : undefined,
    }
  }

  return {
    success: false,
    code: "unknown_error",
    message: "An unexpected error occurred.",
  }
}

export async function confirmBookingByToken(
  token: string,
): Promise<BookingConfirmationResult> {
  const { data, error } = await supabase.rpc(
    "confirm_booking",
    {
      booking_token: token,
    },
  )

  if (error) {
    console.error(
      "Error confirming booking:",
      error,
    )

    return {
      success: false,
      code: "unknown_error",
      message:
        "We could not confirm your booking. Please try again.",
    }
  }

  return normalizeResult(data)
}

export async function cancelBookingByToken(
  token: string,
): Promise<BookingConfirmationResult> {
  const { data, error } = await supabase.rpc(
    "cancel_booking",
    {
      booking_token: token,
    },
  )

  if (error) {
    console.error(
      "Error cancelling booking:",
      error,
    )

    return {
      success: false,
      code: "unknown_error",
      message:
        "We could not cancel your booking. Please try again.",
    }
  }

  return normalizeResult(data)
}