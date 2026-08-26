import { supabase } from "../../../../services/supabase"

import type {
  AdminWaitingListEntry,
} from "../types/waitingList"

const WAITING_LIST_TABLE = "waiting_list"

export async function getAdminWaitingList(): Promise<
  AdminWaitingListEntry[]
> {
  const { data, error } = await supabase
    .from(WAITING_LIST_TABLE)
    .select("*")
    .order("created_at", {
      ascending: false,
    })

  if (error) {
    console.error(
      "Error loading waiting list:",
      error,
    )

    throw new Error(
      error.message ||
        "Could not load the waiting list.",
    )
  }

  return (data ?? []) as AdminWaitingListEntry[]
}