import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabaseServer";

/**
 * Gets the current authenticated user and checks allowlist.
 * Redirects to /login if not authenticated, or /not-authorized if not in allowlist.
 * Returns the user if authenticated and authorized.
 */
export async function getUserOrRedirect() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // Check allowlist: user must exist in allowed_users table
  const { data: allowedUser, error: allowlistError } = await supabase
    .from("allowed_users")
    .select("email")
    .eq("email", user.email)
    .single();

  if (allowlistError || !allowedUser) {
    redirect("/not-authorized");
  }

  return user;
}

/**
 * Gets the current session without redirecting.
 * Returns null if no session exists.
 */
export async function getSession() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  return session;
}

