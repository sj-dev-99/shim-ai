import { Session, User } from "@supabase/supabase-js";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "../supabase/client";

type AuthContextValue = {
  isConfigured: boolean;
  isLoading: boolean;
  session: Session | null;
  user: User | null;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<{ errorMessage: string | null }>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const supabase = getSupabaseBrowserClient();
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(Boolean(supabase));

  useEffect(() => {
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    let mounted = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setIsLoading(false);
    });

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  async function refreshSession() {
    if (!supabase) return;
    const { data } = await supabase.auth.getSession();
    setSession(data.session);
  }

  async function signOut() {
    if (!supabase) return { errorMessage: "Supabase 환경변수가 아직 설정되지 않았습니다." };

    const { error } = await supabase.auth.signOut();
    if (error) return { errorMessage: "로그아웃하지 못했어요. 잠시 후 다시 시도해주세요." };
    setSession(null);
    return { errorMessage: null };
  }

  const value = useMemo<AuthContextValue>(
    () => ({
      isConfigured: Boolean(supabase),
      isLoading,
      session,
      user: session?.user || null,
      refreshSession,
      signOut
    }),
    [isLoading, session, supabase]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}
