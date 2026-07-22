export type SupabasePublicConfig = {
  url: string;
  anonKey: string;
};

export type SupabaseServerConfig = SupabasePublicConfig & {
  serviceRoleKey?: string;
};

function trimValue(value: string | undefined) {
  return value?.trim() || "";
}

export function getSupabasePublicConfig(): SupabasePublicConfig | null {
  const url = trimValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const anonKey = trimValue(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  if (!url || !anonKey) return null;

  return {
    url,
    anonKey
  };
}

export function getSupabaseServerConfig(): SupabaseServerConfig | null {
  const publicConfig = getSupabasePublicConfig();
  const fallbackUrl = trimValue(process.env.SUPABASE_URL);
  const serviceRoleKey = trimValue(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!publicConfig && !fallbackUrl) return null;

  return {
    url: publicConfig?.url || fallbackUrl,
    anonKey: publicConfig?.anonKey || "",
    serviceRoleKey: serviceRoleKey || undefined
  };
}

export function requireSupabasePublicConfig(): SupabasePublicConfig {
  const config = getSupabasePublicConfig();

  if (!config) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return config;
}

export function requireSupabaseServiceRoleConfig(): Required<SupabaseServerConfig> {
  const config = getSupabaseServerConfig();

  if (!config?.url || !config.serviceRoleKey) {
    throw new Error("Missing Supabase service role configuration.");
  }

  return {
    url: config.url,
    anonKey: config.anonKey,
    serviceRoleKey: config.serviceRoleKey
  };
}
