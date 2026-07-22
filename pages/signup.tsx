import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { AuthLayout, AuthMessage } from "../components/AuthLayout";
import { PRIVACY_VERSION, savePendingConsent, TERMS_VERSION } from "../lib/auth/consent";
import { getAuthErrorMessage } from "../lib/auth/messages";
import { useAuth } from "../lib/auth/AuthProvider";
import { getSupabaseBrowserClient } from "../lib/supabase/client";

export default function SignupPage() {
  const { isConfigured } = useAuth();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [message, setMessage] = useState<{ tone: "success" | "error" | "neutral"; text: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = window.setTimeout(() => {
      setResendCooldown((value) => Math.max(0, value - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  async function submitSignup(event: FormEvent<HTMLFormElement>) {
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

    if (!termsAgreed || !privacyAgreed) {
      setMessage({ tone: "error", text: "이용약관과 개인정보처리방침에 동의해야 회원가입할 수 있습니다." });
      return;
    }

    const supabase = getSupabaseBrowserClient();
    if (!supabase) return;

    setIsSubmitting(true);
    setMessage(null);
    savePendingConsent(marketingAgreed);

    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: {
          nickname: nickname.trim() || null,
          terms_version: TERMS_VERSION,
          privacy_version: PRIVACY_VERSION,
          marketing_agreed: marketingAgreed
        }
      }
    });

    if (error) {
      setMessage({ tone: "error", text: getAuthErrorMessage(error.message) });
      setIsSubmitting(false);
      return;
    }

    setMessage({
      tone: "success",
      text: "입력한 이메일로 인증 링크를 보냈어요. 이메일 인증을 완료하면 SHIM Diary를 사용할 수 있습니다."
    });
    setResendCooldown(60);
    setIsSubmitting(false);
  }

  async function resendVerificationEmail() {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !email.trim() || resendCooldown > 0) return;

    const { error } = await supabase.auth.resend({
      type: "signup",
      email: email.trim(),
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`
      }
    });

    if (error) {
      setMessage({ tone: "error", text: getAuthErrorMessage(error.message) });
      return;
    }

    setMessage({ tone: "success", text: "인증 메일을 다시 보냈어요. 메일함을 확인해주세요." });
    setResendCooldown(60);
  }

  return (
    <AuthLayout title="회원가입" description="필요한 정보만 받아 안전하게 SHIM Diary 기록을 보관합니다.">
      {!isConfigured ? (
        <AuthMessage tone="error" message="Supabase 환경변수가 아직 설정되지 않았습니다. .env.local을 먼저 확인해주세요." />
      ) : null}

      {message ? <AuthMessage tone={message.tone} message={message.text} /> : null}

      <form className="auth-form" onSubmit={submitSignup}>
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
          <span>닉네임 선택</span>
          <input
            autoComplete="nickname"
            maxLength={40}
            onChange={(event) => setNickname(event.target.value)}
            placeholder="보고서에 표시할 이름"
            type="text"
            value={nickname}
          />
        </label>

        <label>
          <span>비밀번호</span>
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
          <span>비밀번호 확인</span>
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

        <div className="auth-check-list">
          <label>
            <input checked={termsAgreed} onChange={(event) => setTermsAgreed(event.target.checked)} type="checkbox" />
            <span>
              <Link href="/terms">이용약관</Link>에 동의합니다. <b>필수</b>
            </span>
          </label>
          <label>
            <input checked={privacyAgreed} onChange={(event) => setPrivacyAgreed(event.target.checked)} type="checkbox" />
            <span>
              <Link href="/privacy">개인정보처리방침</Link>에 동의합니다. <b>필수</b>
            </span>
          </label>
          <label>
            <input
              checked={marketingAgreed}
              onChange={(event) => setMarketingAgreed(event.target.checked)}
              type="checkbox"
            />
            <span>서비스 소식 수신에 동의합니다. 선택</span>
          </label>
        </div>

        <button className="auth-submit" disabled={!isConfigured || isSubmitting} type="submit">
          {isSubmitting ? "인증 메일 발송 중..." : "회원가입"}
          <ArrowRight size={18} aria-hidden="true" />
        </button>
      </form>

      {message?.tone === "success" ? (
        <button
          className="auth-resend-button"
          disabled={resendCooldown > 0}
          onClick={resendVerificationEmail}
          type="button"
        >
          {resendCooldown > 0 ? `인증 메일 재발송 ${resendCooldown}초 후 가능` : "인증 메일 다시 보내기"}
        </button>
      ) : null}

      <div className="auth-links">
        <Link href="/login">이미 계정이 있나요? 로그인</Link>
      </div>
    </AuthLayout>
  );
}
