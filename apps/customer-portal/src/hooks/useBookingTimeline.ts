import { useCallback, useEffect, useState } from "react"

import {
  getBookingTimeline,
} from "../services/bookingTimeline"

import type {
  BookingTimelineEvent,
} from "../types/bookingTimeline"

interface UseBookingTimelineResult {
  timeline: BookingTimelineEvent[]
  isLoading: boolean
  error: string | null
  refreshTimeline: () => Promise<void>
}

export function useBookingTimeline(
  bookingId: string | null,
): UseBookingTimelineResult {
  const [timeline, setTimeline] =
    useState<BookingTimelineEvent[]>([])

  const [isLoading, setIsLoading] =
    useState(false)

  const [error, setError] =
    useState<string | null>(null)

  const refreshTimeline =
    useCallback(async () => {
      if (!bookingId) {
        setTimeline([])
        return
      }

      try {
        setIsLoading(true)
        setError(null)

        const data =
          await getBookingTimeline(
            bookingId,
          )

        setTimeline(data)
      } catch (err) {
        console.error(err)

        setError(
          "Could not load booking timeline.",
        )
      } finally {
        setIsLoading(false)
      }
    }, [bookingId])

  useEffect(() => {
    void refreshTimeline()
  }, [refreshTimeline])

  return {
    timeline,
    isLoading,
    error,
    refreshTimeline,
  }
}