import type {
  HTMLAttributes,
  ReactNode,
} from "react"

interface AdminCardProps
  extends HTMLAttributes<HTMLElement> {
  children: ReactNode
}

function AdminCard({
  children,
  className = "",
  ...articleProps
}: AdminCardProps) {
  return (
    <article
      {...articleProps}
      className={[
        "admin-card",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </article>
  )
}

export default AdminCard