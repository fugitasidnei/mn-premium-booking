import { supabase } from "./supabase"

import type {
  NewScheduleBlock,
  ScheduleBlock,
  UpdateScheduleBlock,
} from "../types/scheduleBlock"

export async function getScheduleBlocks(): Promise<
  ScheduleBlock[]
> {
  const {
    data,
    error,
  } = await supabase
    .from("schedule_blocks")
    .select("*")
    .order("block_date", {
      ascending: true,
    })
    .order("start_time", {
      ascending: true,
    })

  if (error) {
    throw error
  }

  return (
    data as ScheduleBlock[]
  ) ?? []
}

export async function createScheduleBlock(
  block: NewScheduleBlock,
): Promise<ScheduleBlock> {
  const {
    data,
    error,
  } = await supabase
    .from("schedule_blocks")
    .insert({
      block_date:
        block.block_date,
      start_time:
        block.start_time,
      end_time:
        block.end_time,
      title:
        block.title.trim(),
      reason:
        block.reason?.trim() ||
        null,
      block_type:
        block.block_type,
    })
    .select("*")
    .single()

  if (error) {
    throw error
  }

  return data as ScheduleBlock
}

export async function updateScheduleBlock(
  blockId: string,
  updates: UpdateScheduleBlock,
): Promise<ScheduleBlock> {
  const {
    data,
    error,
  } = await supabase
    .from("schedule_blocks")
    .update({
      ...updates,
      updated_at:
        new Date().toISOString(),
    })
    .eq("id", blockId)
    .select("*")
    .single()

  if (error) {
    throw error
  }

  return data as ScheduleBlock
}

export async function deleteScheduleBlock(
  blockId: string,
): Promise<void> {
  const {
    error,
  } = await supabase
    .from("schedule_blocks")
    .delete()
    .eq("id", blockId)

  if (error) {
    throw error
  }
}