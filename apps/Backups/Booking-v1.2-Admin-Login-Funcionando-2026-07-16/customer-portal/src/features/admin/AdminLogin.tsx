import { useState } from "react"

import { signInAdmin } from "../../services/adminAuth"

interface AdminLoginProps {
  onLogin: () => void
}

function AdminLogin({
  onLogin,
}: AdminLoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMessage, setErrorMessage] =
    useState("")
  const [isLoading, setIsLoading] =
    useState(false)

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    try {
      setIsLoading(true)
      setErrorMessage("")

      await signInAdmin(email, password)

      onLogin()
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Could not sign in."

      setErrorMessage(message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="admin-login">
      <form
        className="admin-login-card"
        onSubmit={handleSubmit}
      >
        <span>MN PREMIUM SERVICE</span>

        <h1>Admin Login</h1>

        <p>Sign in to manage bookings.</p>

        {errorMessage && (
          <div className="admin-login-error">
            {errorMessage}
          </div>
        )}

        <label>
          Email

          <input
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            required
          />
        </label>

        <label>
          Password

          <input
            type="password"
            value={password}
            onChange={(event) =>
              setPassword(event.target.value)
            }
            required
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
        >
          {isLoading
            ? "SIGNING IN..."
            : "SIGN IN"}
        </button>
      </form>
    </section>
  )
}

export default AdminLogin