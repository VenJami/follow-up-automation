import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

export async function createSupabaseServerClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "Supabase URL and anon key are required. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // Next.js 16+ only allows setting cookies in Server Actions or Route Handlers.
        // Our usage here is in server components (e.g. DashboardPage), so we intentionally
        // NO-OP on cookie writes to avoid runtime errors, while still allowing reads.
        // This is sufficient for our demo use-case where we don't rely on Supabase
        // rotating auth cookies on every request.
        if (process.env.NODE_ENV === "development" && cookiesToSet.length > 0) {
          console.warn(
            "[supabaseServer] Skipped setting cookies from createServerClient (not in a Server Action/Route Handler)."
          );
        }
      },
    },
  });
}
