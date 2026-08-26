import {
  useCallback,
  useEffect,
  useState,
} from "react"

import { supabase } from "../../../../services/supabase"

import {
  getAdminWaitingList,
} from "../services/adminWaitingList"

import type {
  AdminWaitingListEntry,
} from "../types/waitingList"

interface UseAdminWaitingListResult {
  entries: AdminWaitingListEntry[]
  isLoading: boolean
  error: string
  refreshWaitingList: () => Promise<void>
}

export function useAdminWaitingList(): UseAdminWaitingListResult {
  const [
    entries,
    setEntries,
  ] = useState<AdminWaitingListEntry[]>([])

  const [
    isLoading,
    setIsLoading,
  ] = useState(true)

  const [
    error,
    setError,
  ] = useState("")

  const refreshWaitingList =
    useCallback(async () => {
      try {
        setError("")

        const waitingListData =
          await getAdminWaitingList()

        setEntries(waitingListData)
      } catch (requestError) {
        console.error(
          "Error loading admin waiting list:",
          requestError,
        )

        setError(
          "Unable to load the waiting list.",
        )
      } finally {
        setIsLoading(false)
      }
    }, [])

  useEffect(() => {
    void refreshWaitingList()
  }, [refreshWaitingList])

  useEffect(() => {
    const waitingListChannel =
      supabase
        .channel(
          "admin-waiting-list-realtime",
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "waiting_list",
          },
          () => {
            void refreshWaitingList()
          },
        )
        .subscribe((status) => {
          if (status === "CHANNEL_ERROR") {
            console.error(
              "Unable to connect to waiting list realtime.",
            )
          }
        })

    return () => {
      void supabase.removeChannel(
        waitingListChannel,
      )
    }
  }, [refreshWaitingList])

  return {
    entries,
    isLoading,
    error,
    refreshWaitingList,
  }
}
