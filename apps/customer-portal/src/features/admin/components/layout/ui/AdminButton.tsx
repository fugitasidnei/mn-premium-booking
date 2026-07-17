import type {
  ButtonHTMLAttributes,
  ReactNode,
} from "react"

export type AdminButtonVariant =
  | "primary"
  | "secondary"
  | "success"
  | "danger"
  | "warning"
  | "ghost"

interface AdminButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: AdminButtonVariant
  isLoading?: boolean
  fullWidth?: boolean
}

function AdminButton({
  children,
  variant = "primary",
  isLoading = false,
  fullWidth = false,
  className = "",
  disabled,
  type = "button",
  ...buttonProps
}: AdminButtonProps) {
  const buttonClassName = [
    "admin-button",
    `admin-button--${variant}`,
    fullWidth ? "admin-button--full-width" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <button
      {...buttonProps}
      type={type}
      className={buttonClassName}
      disabled={disabled || isLoading}
    >
      {isLoading ? "Loading..." : children}
    </button>
  )
}

export default AdminButton