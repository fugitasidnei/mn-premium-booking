import "./AdminLayout.css"

import type { ReactNode } from "react"

import type { AdminView } from "../../types/AdminView"
import AdminHeader from "./AdminHeader"
import AdminSidebar from "./AdminSidebar"

type AdminLayoutProps = {
  children: ReactNode
  activeView: AdminView
  onChangeView: (view: AdminView) => void
  onLogout: () => void
}

function AdminLayout({
  children,
  activeView,
  onChangeView,
  onLogout,
}: AdminLayoutProps) {
  return (
    <div className="admin-layout">
      <AdminHeader onLogout={onLogout} />

      <div className="admin-content">
        <AdminSidebar
          activeView={activeView}
          onChangeView={onChangeView}
        />

        <main className="admin-main">
          {children}
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
