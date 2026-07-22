import Link from "next/link";
import { FormEvent, useState } from "react";
import { ArrowRight } from "lucide-react";
import { AuthLayout, AuthMessage } from "../components/AuthLayout";
import { getAuthErrorMessage } from "../lib/auth/messages";
import { useAuth } from "../lib/auth/AuthProvider";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

export default function ResetPasswordPage() {
  const { isConfigured, isLoading, user } = useAuth();
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [message, setMessage] = useState<{ tone: "success" | "error" | "neutral"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submitNewPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isConfigured) return;

    if (password.length < 8) {
      setMessage({ tone: "error", text: "비밀번호는 8자 이상 입력해주세요." });
      return;
    }

    if (password !== passwordConfirm) {
      setMessage({ tone: "error", text: "비밀번호와 비밀번호 확인이 일치하지 않습니다." });
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setIsSubmitting(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage({ tone: "error", text: getAuthErrorMessage(error.message) });
      setIsSubmitting(false);
      return;
    }

    setMessage({ tone: "success", text: "비밀번호가 변경되었습니다. 이제 새 비밀번호로 로그인할 수 있어요." });
    setPassword("");
    setPasswordConfirm("");
    setIsSubmitting(false);
  }

  return (
    <AuthLayout title="새 비밀번호 설정" description="새 비밀번호를 입력해 계정 접근을 다시 설정하세요.">
      {!isConfigured ? (
        <AuthMessage tone="error" message="Supabase 환경변수가 아직 설정되지 않았습니다. .env.local을 먼저 확인해주세요." />
      ) : null}

      {!isLoading && !user ? (
        <AuthMessage tone="neutral" message="재설정 링크로 접속했는데 세션이 확인되지 않는다면, 다시 재설정 메일을 요청해주세요." />
      ) : null}

      {message ? <AuthMessage tone={message.tone} message={message.text} /> : null}

      <form className="auth-form" onSubmit={submitNewPassword}>
        <label>
          <span>새 비밀번호</span>
          <input
            autoComplete="new-password"
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="8자 이상 입력해주세요"
            required
            type="password"
            value={password}
          />
        </label>

        <label>
          <span>새 비밀번호 확인</span>
          <input
            autoComplete="new-password"
            minLength={8}
            onChange={(event) => setPasswordConfirm(event.target.value)}
            placeholder="비밀번호를 한 번 더 입력해주세요"
            required
            type="password"
            value={passwordConfirm}
          />
        </label>

        <button className="auth-submit" disabled={!isConfigured || isSubmitting || !user} type="submit">
          {isSubmitting ? "변경 중..." : "비밀번호 변경"}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </form>

      <div className="auth-links">
        <Link href="/forgot-password">재설정 메일 다시 받기</Link>
        <Link href="/login">로그인으로 돌아가기</Link>
      </div>
    </AuthLayout>
  );
}
