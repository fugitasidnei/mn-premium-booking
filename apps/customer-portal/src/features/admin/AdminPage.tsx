import { useEffect, useState } from "react"
import "./components/layout/ui/adminUi.css"
import AdminLogin from "./AdminLogin"
import AdminLayout from "./components/layout/AdminLayout"
import BookingPage from "./pages/BookingPage"
import CustomersPage from "./pages/CustomersPage"
import DashboardHome from "./pages/DashboardHome"
import SchedulePage from "./pages/SchedulePage"
import SettingsPage from "./pages/SettingsPage"
import WaitingListPage from "./pages/WaitingListPage"
import type { AdminView } from "./types/AdminView"

import {
  getAdminSession,
  signOutAdmin,
} from "../../services/adminAuth"

function AdminPage() {
  const [isCheckingSession, setIsCheckingSession] =
    useState(true)

  const [isLoggedIn, setIsLoggedIn] =
    useState(false)

  const [activeView, setActiveView] =
    useState<AdminView>("dashboard")

  useEffect(() => {
    async function checkSession() {
      try {
        const session = await getAdminSession()

        setIsLoggedIn(Boolean(session))
      } finally {
        setIsCheckingSession(false)
      }
    }

    void checkSession()
  }, [])

  async function handleLogout() {
    await signOutAdmin()

    setIsLoggedIn(false)
    setActiveView("dashboard")
  }

  function renderActivePage() {
    switch (activeView) {
      case "bookings":
        return <BookingPage />

      case "customers":
        return <CustomersPage />

      case "schedule":
        return <SchedulePage />

      case "waiting-list":
        return <WaitingListPage />

      case "settings":
        return <SettingsPage />

      default:
        return <DashboardHome />
    }
  }

  if (isCheckingSession) {
    return (
      <main>
        <p>Checking administrator session...</p>
      </main>
    )
  }

  if (!isLoggedIn) {
    return (
      <AdminLogin
        onLogin={() => setIsLoggedIn(true)}
      />
    )
  }

  return (
    <AdminLayout
      activeView={activeView}
      onChangeView={setActiveView}
      onLogout={handleLogout}
    >
      {renderActivePage()}
    </AdminLayout>
  )
}

export default AdminPage