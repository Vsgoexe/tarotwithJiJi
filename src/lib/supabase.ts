import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Returns a server-side Supabase client using the service role key.
 * This client bypasses Row Level Security (RLS) for authoritative writes (e.g., webhook updates, payment records).
 * NEVER expose this client to the browser.
 */
export function getServiceSupabaseClient(): SupabaseClient | null {
  const url = supabaseUrl;
  const key = supabaseServiceRoleKey || supabaseAnonKey;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Public client for client-side or anon read operations.
 */
export function getPublicSupabaseClient(): SupabaseClient | null {
  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }
  return createClient(supabaseUrl, supabaseAnonKey);
}
