import {
  useCallback,
  useEffect,
  useState,
} from "react"

import { supabase } from "../services/supabase"

import {
  cancelAdminBooking,
  confirmAdminBooking,
  deleteAdminBooking,
  getAdminBookings,
} from "../services/adminBookings"

import type {
  AdminBooking,
} from "../types/adminBooking"

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
  deleteBooking: (
    bookingId: string,
  ) => Promise<void>
}

export function useAdminBookings(): UseAdminBookingsResult {
  const [
    bookings,
    setBookings,
  ] = useState<AdminBooking[]>([])

  const [
    isLoading,
    setIsLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState("")

  const [
    actionBookingId,
    setActionBookingId,
  ] = useState<string | null>(
    null,
  )

  const refreshBookings =
    useCallback(async () => {
      try {
        setError("")

        const bookingsData =
          await getAdminBookings()

        setBookings(
          bookingsData,
        )
      } catch (requestError) {
        console.error(
          "Error loading admin bookings:",
          requestError,
        )

        setError(
          "Unable to load bookings.",
        )
      } finally {
        setIsLoading(false)
      }
    }, [])

  useEffect(() => {
    void refreshBookings()
  }, [refreshBookings])

  useEffect(() => {
    const bookingsChannel =
      supabase
        .channel(
          "admin-bookings-realtime",
        )
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
        .subscribe(
          (status) => {
            if (
              status ===
              "CHANNEL_ERROR"
            ) {
              console.error(
                "Unable to connect to bookings realtime.",
              )
            }
          },
        )

    return () => {
      void supabase.removeChannel(
        bookingsChannel,
      )
    }
  }, [refreshBookings])

  const confirmBooking =
    useCallback(
      async (
        bookingId: string,
      ) => {
        try {
          setError("")
          setActionBookingId(
            bookingId,
          )

          await confirmAdminBooking(
            bookingId,
          )

          await refreshBookings()
        } catch (requestError) {
          console.error(
            "Error confirming booking:",
            requestError,
          )

          setError(
            "Unable to confirm booking.",
          )

          throw requestError
        } finally {
          setActionBookingId(
            null,
          )
        }
      },
      [refreshBookings],
    )

  const cancelBooking =
    useCallback(
      async (
        bookingId: string,
      ) => {
        try {
          setError("")
          setActionBookingId(
            bookingId,
          )

          await cancelAdminBooking(
            bookingId,
          )

          await refreshBookings()
        } catch (requestError) {
          console.error(
            "Error cancelling booking:",
            requestError,
          )

          setError(
            "Unable to cancel booking.",
          )

          throw requestError
        } finally {
          setActionBookingId(
            null,
          )
        }
      },
      [refreshBookings],
    )

  const deleteBooking =
    useCallback(
      async (
        bookingId: string,
      ) => {
        try {
          setError("")
          setActionBookingId(
            bookingId,
          )

          await deleteAdminBooking(
            bookingId,
          )

          setBookings(
            (currentBookings) =>
              currentBookings.filter(
                (booking) =>
                  booking.id !==
                  bookingId,
              ),
          )

          await refreshBookings()
        } catch (requestError) {
          console.error(
            "Error deleting booking:",
            requestError,
          )

          setError(
            "Unable to delete booking.",
          )

          throw requestError
        } finally {
          setActionBookingId(
            null,
          )
        }
      },
      [refreshBookings],
    )

  return {
    bookings,
    isLoading,
    error,
    actionBookingId,
    refreshBookings,
    confirmBooking,
    cancelBooking,
    deleteBooking,
  }
}