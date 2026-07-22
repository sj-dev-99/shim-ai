import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { ArrowRight } from "lucide-react";
import { AuthLayout, AuthMessage } from "../components/AuthLayout";
import { getAuthErrorMessage } from "../lib/auth/messages";
import { useAuth } from "../lib/auth/AuthProvider";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const { isConfigured, isLoading, user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ tone: "success" | "error" | "neutral"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(typeof router.query.next === "string" ? router.query.next : "/diary");
    }
  }, [isLoading, router, user]);

  async function submitLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isConfigured) return;

    setIsSubmitting(true);
    setMessage(null);

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password
    });

    if (error) {
      setMessage({ tone: "error", text: getAuthErrorMessage(error.message) });
      setIsSubmitting(false);
      return;
    }

    setMessage({ tone: "success", text: "로그인되었습니다. 잠시만 기다려주세요." });
    router.replace(typeof router.query.next === "string" ? router.query.next : "/diary");
  }

  return (
    <AuthLayout title="로그인" description="로그인하면 휴대전화와 PC에서 같은 기록을 이어서 볼 수 있습니다.">
      {!isConfigured ? (
        <AuthMessage tone="error" message="Supabase 환경변수가 아직 설정되지 않았습니다. .env.local을 먼저 확인해주세요." />
      ) : null}

      {message ? <AuthMessage tone={message.tone} message={message.text} /> : null}

      <form className="auth-form" onSubmit={submitLogin}>
        <label>
          <span>이메일</span>
          <input
            autoComplete="email"
            inputMode="email"
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            required
            type="email"
            value={email}
          />
        </label>

        <label>
          <span>비밀번호</span>
          <input
            autoComplete="current-password"
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="8자 이상 입력해주세요"
            required
            type="password"
            value={password}
          />
        </label>

        <button className="auth-submit" disabled={!isConfigured || isSubmitting} type="submit">
          {isSubmitting ? "로그인 중..." : "로그인"}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </form>

      <div className="auth-links">
        <Link href="/forgot-password">비밀번호를 잊으셨나요?</Link>
        <Link href="/signup">아직 계정이 없나요? 회원가입</Link>
      </div>
    </AuthLayout>
  );
}
