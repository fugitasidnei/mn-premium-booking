import type { ReactNode } from "react"

export type AdminBadgeVariant =
  | "neutral"
  | "pending"
  | "confirmed"
  | "cancelled"
  | "success"
  | "warning"
  | "danger"

interface AdminBadgeProps {
  children: ReactNode
  variant?: AdminBadgeVariant
}

function AdminBadge({
  children,
  variant = "neutral",
}: AdminBadgeProps) {
  return (
    <span
      className={`admin-badge admin-badge--${variant}`}
    >
      {children}
    </span>
  )
}

export default AdminBadge