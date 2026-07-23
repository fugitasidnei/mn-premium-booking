import {
  useCallback,
  useEffect,
  useState,
} from "react"

import { supabase } from "../services/supabase"

import {
  createScheduleBlock,
  deleteScheduleBlock,
  getScheduleBlocks,
  updateScheduleBlock,
} from "../services/scheduleBlocks"

import type {
  NewScheduleBlock,
  ScheduleBlock,
  UpdateScheduleBlock,
} from "../types/scheduleBlock"

interface UseScheduleBlocksResult {
  scheduleBlocks: ScheduleBlock[]
  isLoadingScheduleBlocks: boolean
  scheduleBlocksError: string
  actionScheduleBlockId:
    | string
    | null
  refreshScheduleBlocks:
    () => Promise<void>
  addScheduleBlock: (
    block: NewScheduleBlock,
  ) => Promise<void>
  editScheduleBlock: (
    blockId: string,
    updates: UpdateScheduleBlock,
  ) => Promise<void>
  removeScheduleBlock: (
    blockId: string,
  ) => Promise<void>
}

export function useScheduleBlocks(): UseScheduleBlocksResult {
  const [
    scheduleBlocks,
    setScheduleBlocks,
  ] = useState<
    ScheduleBlock[]
  >([])

  const [
    isLoadingScheduleBlocks,
    setIsLoadingScheduleBlocks,
  ] = useState(true)

  const [
    scheduleBlocksError,
    setScheduleBlocksError,
  ] = useState("")

  const [
    actionScheduleBlockId,
    setActionScheduleBlockId,
  ] = useState<
    string | null
  >(null)

  const refreshScheduleBlocks =
    useCallback(async () => {
      try {
        setScheduleBlocksError("")

        const data =
          await getScheduleBlocks()

        setScheduleBlocks(data)
      } catch (requestError) {
        console.error(
          "Error loading schedule blocks:",
          requestError,
        )

        setScheduleBlocksError(
          "Unable to load schedule blocks.",
        )
      } finally {
        setIsLoadingScheduleBlocks(
          false,
        )
      }
    }, [])

  useEffect(() => {
    void refreshScheduleBlocks()
  }, [refreshScheduleBlocks])

  useEffect(() => {
    const channel =
      supabase
        .channel(
          "admin-schedule-blocks-realtime",
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "schedule_blocks",
          },
          () => {
            void refreshScheduleBlocks()
          },
        )
        .subscribe(
          (status) => {
            if (
              status ===
              "CHANNEL_ERROR"
            ) {
              console.error(
                "Unable to connect to schedule blocks realtime.",
              )
            }
          },
        )

    return () => {
      void supabase.removeChannel(
        channel,
      )
    }
  }, [refreshScheduleBlocks])

  const addScheduleBlock =
    useCallback(
      async (
        block: NewScheduleBlock,
      ) => {
        try {
          setScheduleBlocksError("")

          await createScheduleBlock(
            block,
          )

          await refreshScheduleBlocks()
        } catch (requestError) {
          console.error(
            "Error creating schedule block:",
            requestError,
          )

          setScheduleBlocksError(
            "Unable to create schedule block.",
          )

          throw requestError
        }
      },
      [refreshScheduleBlocks],
    )

  const editScheduleBlock =
    useCallback(
      async (
        blockId: string,
        updates: UpdateScheduleBlock,
      ) => {
        try {
          setScheduleBlocksError("")
          setActionScheduleBlockId(
            blockId,
          )

          await updateScheduleBlock(
            blockId,
            updates,
          )

          await refreshScheduleBlocks()
        } catch (requestError) {
          console.error(
            "Error updating schedule block:",
            requestError,
          )

          setScheduleBlocksError(
            "Unable to update schedule block.",
          )

          throw requestError
        } finally {
          setActionScheduleBlockId(
            null,
          )
        }
      },
      [refreshScheduleBlocks],
    )

  const removeScheduleBlock =
    useCallback(
      async (
        blockId: string,
      ) => {
        try {
          setScheduleBlocksError("")
          setActionScheduleBlockId(
            blockId,
          )

          await deleteScheduleBlock(
            blockId,
          )

          await refreshScheduleBlocks()
        } catch (requestError) {
          console.error(
            "Error deleting schedule block:",
            requestError,
          )

          setScheduleBlocksError(
            "Unable to delete schedule block.",
          )

          throw requestError
        } finally {
          setActionScheduleBlockId(
            null,
          )
        }
      },
      [refreshScheduleBlocks],
    )

  return {
    scheduleBlocks,
    isLoadingScheduleBlocks,
    scheduleBlocksError,
    actionScheduleBlockId,
    refreshScheduleBlocks,
    addScheduleBlock,
    editScheduleBlock,
    removeScheduleBlock,
  }
}