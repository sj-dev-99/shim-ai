import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "./config";
import { Database } from "./types";

export function createSupabaseServerClient(accessToken?: string) {
  const config = getSupabasePublicConfig();
  if (!config) return null;

  return createClient<Database>(config.url, config.anonKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    },
    global: accessToken
      ? {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      : undefined
  });
}
