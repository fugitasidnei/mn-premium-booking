export type ScheduleBlockType =
  | "lunch"
  | "maintenance"
  | "personal"
  | "unavailable"

export interface ScheduleBlock {
  id: string
  block_date: string
  start_time: string
  end_time: string
  title: string
  reason: string | null
  block_type: ScheduleBlockType
  created_at: string
  updated_at: string
}

export interface NewScheduleBlock {
  block_date: string
  start_time: string
  end_time: string
  title: string
  reason?: string
  block_type: ScheduleBlockType
}

export interface UpdateScheduleBlock {
  block_date?: string
  start_time?: string
  end_time?: string
  title?: string
  reason?: string | null
  block_type?: ScheduleBlockType
}