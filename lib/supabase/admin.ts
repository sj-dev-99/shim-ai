import { createClient } from "@supabase/supabase-js";
import { requireSupabaseServiceRoleConfig } from "./config";
import { Database } from "./types";

// Server-only helper. Never import this file from React components or browser code.
export function createSupabaseAdminClient() {
  const config = requireSupabaseServiceRoleConfig();

  return createClient<Database>(config.url, config.serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}
