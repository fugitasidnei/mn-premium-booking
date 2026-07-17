import type {
  InputHTMLAttributes,
} from "react"

interface AdminInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

function AdminInput({
  label,
  error,
  id,
  className = "",
  ...inputProps
}: AdminInputProps) {
  const inputId =
    id ?? inputProps.name

  return (
    <label className="admin-field">
      {label && (
        <span className="admin-field__label">
          {label}
        </span>
      )}

      <input
        {...inputProps}
        id={inputId}
        className={[
          "admin-input",
          error ? "admin-input--error" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
      />

      {error && (
        <span className="admin-field__error">
          {error}
        </span>
      )}
    </label>
  )
}

export default AdminInput