import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { BrainCircuit } from "lucide-react";
import { clearPendingConsent, readPendingConsent } from "../../lib/auth/consent";
import { getAuthErrorMessage } from "../../lib/auth/messages";
import { getSupabaseBrowserClient } from "../../lib/supabase/client";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [message, setMessage] = useState("이메일 인증을 확인하고 있어요.");
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function finishAuth() {
      const supabase = getSupabaseBrowserClient();
      if (!supabase) {
        setHasError(true);
        setMessage("Supabase 환경변수가 아직 설정되지 않았습니다.");
        return;
      }

      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setHasError(true);
        setMessage(getAuthErrorMessage(error.message));
        return;
      }

      const session = data.session;
      if (!session?.user) {
        setHasError(true);
        setMessage("인증 세션을 확인하지 못했어요. 메일 링크를 다시 열거나 로그인해주세요.");
        return;
      }

      const pendingConsent = readPendingConsent();
      if (pendingConsent) {
        const { error: consentError } = await supabase.from("user_consents").insert({
          user_id: session.user.id,
          terms_version: pendingConsent.termsVersion,
          privacy_version: pendingConsent.privacyVersion,
          marketing_agreed: pendingConsent.marketingAgreed,
          marketing_agreed_at: pendingConsent.marketingAgreed ? pendingConsent.createdAt : null
        });

        if (!consentError) {
          clearPendingConsent();
        }
      }

      setMessage("인증이 완료되었습니다. SHIM Diary로 이동합니다.");
      window.setTimeout(() => {
        router.replace("/diary");
      }, 900);
    }

    finishAuth();
  }, [router]);

  return (
    <>
      <Head>
        <title>인증 확인 | shim.ai</title>
      </Head>
      <main className="page-shell auth-shell">
        <section className="auth-card auth-callback-card" aria-live="polite">
          <span className="brand-mark">
            <BrainCircuit size={22} aria-hidden="true" />
          </span>
          <h1>{hasError ? "인증을 완료하지 못했어요" : "인증 확인 중"}</h1>
          <p>{message}</p>
          {hasError ? (
            <div className="auth-links">
              <Link href="/login">로그인으로 이동</Link>
              <Link href="/forgot-password">재설정 메일 다시 받기</Link>
            </div>
          ) : null}
        </section>
      </main>
    </>
  );
}
