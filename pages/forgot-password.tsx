import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { AuthLayout, AuthMessage } from "../components/AuthLayout";
import { getAuthErrorMessage } from "../lib/auth/messages";
import { useAuth } from "../lib/auth/AuthProvider";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

export default function ForgotPasswordPage() {
  const { isConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<{ tone: "success" | "error" | "neutral"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitResetRequest(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isConfigured) return;

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setIsSubmitting(true);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`
    });

    if (error) {
      setMessage({ tone: "error", text: getAuthErrorMessage(error.message) });
      setIsSubmitting(false);
      return;
    }

    setMessage({ tone: "success", text: "비밀번호 재설정 링크를 이메일로 보냈어요. 메일함을 확인해주세요." });
    setIsSubmitting(false);
  }

  return (
    <AuthLayout title="비밀번호 재설정" description="가입한 이메일로 비밀번호 재설정 링크를 보내드립니다.">
      {!isConfigured ? (
        <AuthMessage tone="error" message="Supabase 환경변수가 아직 설정되지 않았습니다. .env.local을 먼저 확인해주세요." />
      ) : null}

      {message ? <AuthMessage tone={message.tone} message={message.text} /> : null}

      <form className="auth-form" onSubmit={submitResetRequest}>
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

        <button className="auth-submit" disabled={!isConfigured || isSubmitting} type="submit">
          {isSubmitting ? "발송 중..." : "재설정 링크 받기"}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </form>

      <div className="auth-links">
        <Link href="/login">로그인으로 돌아가기</Link>
      </div>
    </AuthLayout>
  );
}
