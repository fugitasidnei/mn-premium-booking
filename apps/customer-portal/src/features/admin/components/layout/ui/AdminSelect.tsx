import type {
  ReactNode,
  SelectHTMLAttributes,
} from "react"

interface AdminSelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  children: ReactNode
}

function AdminSelect({
  label,
  error,
  children,
  id,
  className = "",
  ...selectProps
}: AdminSelectProps) {
  const selectId =
    id ?? selectProps.name

  return (
    <label className="admin-field">
      {label && (
        <span className="admin-field__label">
          {label}
        </span>
      )}

      <select
        {...selectProps}
        id={selectId}
        className={[
          "admin-select",
          error ? "admin-select--error" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </select>

      {error && (
        <span className="admin-field__error">
          {error}
        </span>
      )}
    </label>
  )
}

export default AdminSelect