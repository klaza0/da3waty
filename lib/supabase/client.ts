import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";
import { getSupabaseAnonKey, getSupabaseUrl, isSupabaseConfigured } from "./env";

export function createClient() {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured");
  }

  return createBrowserClient<Database>(getSupabaseUrl(), getSupabaseAnonKey());
}
