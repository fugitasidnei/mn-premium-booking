import type {
  ReactNode,
  TableHTMLAttributes,
} from "react"

interface AdminTableProps
  extends TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode
  minWidth?: number
}

function AdminTable({
  children,
  minWidth = 1000,
  className = "",
  style,
  ...tableProps
}: AdminTableProps) {
  return (
    <div className="admin-table-wrapper">
      <table
        {...tableProps}
        className={[
          "admin-table",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        style={{
          minWidth,
          ...style,
        }}
      >
        {children}
      </table>
    </div>
  )
}

export default AdminTable