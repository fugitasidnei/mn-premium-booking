import { supabase } from "./supabase"

export async function signInAdmin(
  email: string,
  password: string,
): Promise<void> {
  const { error } =
    await supabase.auth.signInWithPassword({
      email,
      password,
    })

  if (error) {
    throw new Error(
      "Invalid email or password.",
    )
  }

  const { data, error: adminError } =
    await supabase.rpc("is_admin")

  if (adminError || data !== true) {
    await supabase.auth.signOut({
      scope: "local",
    })

    throw new Error(
      "This account does not have administrator access.",
    )
  }
}

export async function signOutAdmin(): Promise<void> {
  const { error } = await supabase.auth.signOut({
    scope: "local",
  })

  if (error) {
    throw new Error(
      "Could not sign out. Please try again.",
    )
  }
}

export async function getAdminSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error) {
    throw new Error(
      "Could not verify the administrator session.",
    )
  }

  if (!session) {
    return null
  }

  const { data, error: adminError } =
    await supabase.rpc("is_admin")

  if (adminError || data !== true) {
    await supabase.auth.signOut({
      scope: "local",
    })

    return null
  }

  return session
}