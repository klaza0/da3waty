import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./env";

export async function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Called from a Server Component; middleware refreshes the session.
        }
      },
    },
  });
}
