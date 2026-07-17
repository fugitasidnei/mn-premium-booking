import "./DashboardGrid.css"

type DashboardGridProps = {
  children: React.ReactNode
}

function DashboardGrid({
  children,
}: DashboardGridProps) {
  return (
    <div className="dashboard-grid">
      {children}
    </div>
  )
}

export default DashboardGrid