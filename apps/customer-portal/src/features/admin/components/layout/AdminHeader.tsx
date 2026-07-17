import "./AdminHeader.css"

type AdminHeaderProps = {
  onLogout: () => void
}

function AdminHeader({
  onLogout,
}: AdminHeaderProps) {
  return (
    <header className="admin-header">
      <div className="admin-header-brand">
        <span>MN PREMIUM SERVICE</span>
        <h1>Admin Dashboard</h1>
      </div>

      <div className="admin-header-actions">
        <div className="admin-header-status">
          <span className="admin-header-status__dot" />
          <span>System Online</span>
        </div>

        <button
          className="admin-logout-button"
          type="button"
          onClick={onLogout}
        >
          Sign Out
        </button>
      </div>
    </header>
  )
}

export default AdminHeader