import {
  useCallback,
  useEffect,
  useState,
} from "react"

import { supabase } from "../services/supabase"

import {
  cancelAdminBooking,
  confirmAdminBooking,
  getAdminBookings,
} from "../services/adminBookings"

import type { AdminBooking } from "../types/adminBooking"

interface UseAdminBookingsResult {
  bookings: AdminBooking[]
  isLoading: boolean
  error: string
  actionBookingId: string | null
  refreshBookings: () => Promise<void>
  confirmBooking: (
    bookingId: string,
  ) => Promise<void>
  cancelBooking: (
    bookingId: string,
  ) => Promise<void>
}

export function useAdminBookings(): UseAdminBookingsResult {
  const [bookings, setBookings] = useState<
    AdminBooking[]
  >([])

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] = useState("")

  const [
    actionBookingId,
    setActionBookingId,
  ] = useState<string | null>(null)

  const refreshBookings =
    useCallback(async () => {
      try {
        setError("")

        const bookingsData =
          await getAdminBookings()

        setBookings(bookingsData)
      } catch (loadError) {
        const message =
          loadError instanceof Error
            ? loadError.message
            : "Could not load the bookings."

        setError(message)
      } finally {
        setIsLoading(false)
      }
    }, [])

  useEffect(() => {
    void refreshBookings()
  }, [refreshBookings])

  useEffect(() => {
    const channel = supabase
      .channel("admin-bookings-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookings",
        },
        () => {
          void refreshBookings()
        },
      )
      .subscribe()

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [refreshBookings])

  async function confirmBooking(
    bookingId: string,
  ): Promise<void> {
    try {
      setActionBookingId(bookingId)
      setError("")

      await confirmAdminBooking(bookingId)
      await refreshBookings()
    } catch (confirmError) {
      const message =
        confirmError instanceof Error
          ? confirmError.message
          : "Could not confirm the booking."

      setError(message)
    } finally {
      setActionBookingId(null)
    }
  }

  async function cancelBooking(
    bookingId: string,
  ): Promise<void> {
    try {
      setActionBookingId(bookingId)
      setError("")

      await cancelAdminBooking(bookingId)
      await refreshBookings()
    } catch (cancelError) {
      const message =
        cancelError instanceof Error
          ? cancelError.message
          : "Could not cancel the booking."

      setError(message)
    } finally {
      setActionBookingId(null)
    }
  }

  return {
    bookings,
    isLoading,
    error,
    actionBookingId,
    refreshBookings,
    confirmBooking,
    cancelBooking,
  }
}