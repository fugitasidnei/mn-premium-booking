import { useEffect, useState } from "react"

import { getDashboardStats } from "../services/dashboardService"
import type { DashboardStats } from "../types/DashboardStats"

const initialStats: DashboardStats = {
  todayBookings: 0,
  waitingList: 0,
  customers: 0,
  completedToday: 0,
  premiumBookings: 0,
  todayRevenue: 0,
}

export function useDashboard() {
  const [stats, setStats] =
    useState<DashboardStats>(initialStats)

  const [isLoading, setIsLoading] =
    useState(true)

  const [error, setError] =
    useState<string | null>(null)

  useEffect(() => {
    async function loadDashboard() {
      try {
        setError(null)

        const data = await getDashboardStats()

        setStats(data)
      } catch {
        setError(
          "Could not load dashboard information.",
        )
      } finally {
        setIsLoading(false)
      }
    }

    void loadDashboard()
  }, [])

  return {
    stats,
    isLoading,
    error,
  }
}
