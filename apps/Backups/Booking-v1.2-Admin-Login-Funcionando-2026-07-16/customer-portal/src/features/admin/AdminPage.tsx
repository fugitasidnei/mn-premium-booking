import { useEffect, useState } from "react"

import AdminLogin from "./AdminLogin"
import {
  getAdminSession,
  signOutAdmin,
} from "../../services/adminAuth"

function AdminPage() {
  const [isCheckingSession, setIsCheckingSession] =
    useState(true)

  const [isLoggedIn, setIsLoggedIn] =
    useState(false)

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
    <main>
      <section>
        <span>MN PREMIUM SERVICE</span>

        <h1>Admin Dashboard</h1>

        <p>
          Administrator login completed successfully.
        </p>

        <button
          type="button"
          onClick={handleLogout}
        >
          SIGN OUT
        </button>
      </section>
    </main>
  )
}

export default AdminPage