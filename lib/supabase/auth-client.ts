"use client";

import { createClient } from "@supabase/supabase-js";

let _authClient: ReturnType<typeof createClient> | null = null;

/**
 * Returns a Supabase client configured for auth (with session persistence).
 * This is separate from the realtime client which disables sessions.
 */
export function getAuthClient() {
  if (_authClient) return _authClient;
  _authClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    },
  );
  return _authClient;
}
