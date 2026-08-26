export type WaitingListStatus =
  | "waiting"
  | "contacted"
  | "scheduled"
  | "cancelled"

export interface AdminWaitingListEntry {
  id: string
  full_name: string
  phone: string
  email: string
  vehicle: string
  service: string
  preferred_date: string
  preferred_time: string
  plate_type: string
  status: WaitingListStatus
  created_at: string
  contacted_at: string | null
  completed_at: string | null
}