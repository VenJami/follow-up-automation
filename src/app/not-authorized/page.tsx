"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabaseClient";

export default function NotAuthorizedPage() {
  const [isSigningOut, setIsSigningOut] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function signOutAndRedirect() {
      try {
        const supabase = createSupabaseBrowserClient();
        await supabase.auth.signOut();
      } catch (error) {
        console.error("Error signing out:", error);
      } finally {
        setIsSigningOut(false);
      }
    }

    signOutAndRedirect();
  }, []);

  function handleBackToLogin() {
    router.push("/login");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm border border-slate-100 text-center">
        <h1 className="text-xl font-semibold text-slate-900 mb-2">
          Access Not Authorized
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          Your account is not authorized to access this application. Please
          contact support if you believe this is an error.
        </p>
        {isSigningOut ? (
          <p className="text-sm text-slate-500">Signing out...</p>
        ) : (
          <button
            onClick={handleBackToLogin}
            className="inline-block rounded-lg bg-sky-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-sky-600 transition-colors"
          >
            Back to Login
          </button>
        )}
      </div>
    </main>
  );
}
