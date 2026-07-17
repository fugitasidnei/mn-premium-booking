import "./AdminSidebar.css"

import type { AdminView } from "../../types/AdminView"

type AdminSidebarProps = {
  activeView: AdminView
  onChangeView: (view: AdminView) => void
}

type MenuItem = {
  label: string
  view: AdminView
}

const menuItems: MenuItem[] = [
  {
    label: "Dashboard",
    view: "dashboard",
  },
  {
    label: "Bookings",
    view: "bookings",
  },
  {
    label: "Customers",
    view: "customers",
  },
  {
    label: "Schedule",
    view: "schedule",
  },
  {
    label: "Waiting List",
    view: "waiting-list",
  },
  {
    label: "Settings",
    view: "settings",
  },
]

function AdminSidebar({
  activeView,
  onChangeView,
}: AdminSidebarProps) {
  return (
    <aside className="admin-sidebar">
      <h2>MN Premium Service</h2>

      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.view}>
              <button
                className={
                  activeView === item.view
                    ? "admin-menu-button active"
                    : "admin-menu-button"
                }
                type="button"
                onClick={() =>
                  onChangeView(item.view)
                }
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}

export default AdminSidebar