import type { DashboardStats } from "../types/DashboardStats"

export async function getDashboardStats(): Promise<DashboardStats> {
  return {
    todayBookings: 0,
    waitingList: 0,
    customers: 0,
    completedToday: 0,
    premiumBookings: 0,
    todayRevenue: 0,
  }
}