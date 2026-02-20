import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(new URL("/login", requestUrl.origin));
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.redirect(new URL("/login?error=config", requestUrl.origin));
  }

  const cookieStore = await cookies();
  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch (error) {
          // Cookie setting can fail in some contexts, but we'll continue
          console.error("Error setting cookies in callback:", error);
        }
      },
    },
  });

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error("Error exchanging code for session:", error);
    return NextResponse.redirect(new URL("/login?error=auth", requestUrl.origin));
  }

  // Check allowlist immediately after successful auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.email) {
    const { data: allowedUser } = await supabase
      .from("allowed_users")
      .select("email")
      .eq("email", user.email)
      .single();

    if (!allowedUser) {
      // User is authenticated but not in allowlist
      return NextResponse.redirect(new URL("/not-authorized", requestUrl.origin));
    }
  }

  return NextResponse.redirect(new URL("/dashboard?welcome=true", requestUrl.origin));
}

