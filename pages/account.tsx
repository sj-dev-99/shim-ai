import Link from "next/link";
import { useRouter } from "next/router";
import { FormEvent, useEffect, useState } from "react";
import { KeyRound, LogOut, Save, Trash2 } from "lucide-react";
import { AuthLayout, AuthMessage } from "../components/AuthLayout";
import { PRIVACY_VERSION, TERMS_VERSION } from "../lib/auth/consent";
import { getAuthErrorMessage } from "../lib/auth/messages";
import { useAuth } from "../lib/auth/AuthProvider";
import { getSupabaseBrowserClient } from "../lib/supabase/client";
import { UserConsent, UserProfile } from "../lib/supabase/types";

type AccountMessage = {
  tone: "success" | "error" | "neutral";
  text: string;
};

export default function AccountPage() {
  const router = useRouter();
  const { isConfigured, isLoading, session, signOut, user } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [consent, setConsent] = useState<UserConsent | null>(null);
  const [nickname, setNickname] = useState("");
  const [marketingAgreed, setMarketingAgreed] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deletePassword, setDeletePassword] = useState("");
  const [message, setMessage] = useState<AccountMessage | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingConsent, setIsSavingConsent] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = getSupabaseBrowserClient();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/login?next=${encodeURIComponent("/account")}`);
    }
  }, [isLoading, router, user]);

  useEffect(() => {
    if (!user || !supabase) return;

    loadAccountData();
  }, [user?.id]);

  async function loadAccountData() {
    if (!user || !supabase) return;

    const [{ data: profileRow }, { data: consentRows }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
      supabase.from("user_consents").select("*").order("created_at", { ascending: false }).limit(1)
    ]);

    setProfile(profileRow || null);
    setNickname(profileRow?.nickname || "");

    const latestConsent = consentRows?.[0] || null;
    setConsent(latestConsent);
    setMarketingAgreed(Boolean(latestConsent?.marketing_agreed));
  }

  async function saveProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user || !supabase) return;

    setIsSavingProfile(true);
    setMessage(null);

    const { data, error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        nickname: nickname.trim() || null
      })
      .select("*")
      .single();

    if (error || !data) {
      setMessage({ tone: "error", text: "닉네임을 저장하지 못했어요. 다시 시도해주세요." });
      setIsSavingProfile(false);
      return;
    }

    setProfile(data);
    setMessage({ tone: "success", text: "닉네임을 저장했습니다." });
    setIsSavingProfile(false);
  }

  async function saveMarketingConsent() {
    if (!user || !supabase) return;

    setIsSavingConsent(true);
    setMessage(null);

    const payload = {
      user_id: user.id,
      terms_version: consent?.terms_version || TERMS_VERSION,
      privacy_version: consent?.privacy_version || PRIVACY_VERSION,
      marketing_agreed: marketingAgreed,
      marketing_agreed_at: marketingAgreed ? new Date().toISOString() : null
    };
    const request = consent
      ? supabase.from("user_consents").update(payload).eq("id", consent.id).select("*").single()
      : supabase.from("user_consents").insert(payload).select("*").single();
    const { data, error } = await request;

    if (error || !data) {
      setMessage({ tone: "error", text: "수신 동의 상태를 저장하지 못했어요. 다시 시도해주세요." });
      setIsSavingConsent(false);
      return;
    }

    setConsent(data);
    setMessage({ tone: "success", text: "수신 동의 상태를 저장했습니다." });
    setIsSavingConsent(false);
  }

  async function changePassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!supabase) return;

    if (password.length < 8) {
      setMessage({ tone: "error", text: "비밀번호는 8자 이상 입력해주세요." });
      return;
    }

    if (password !== passwordConfirm) {
      setMessage({ tone: "error", text: "비밀번호와 비밀번호 확인이 일치하지 않습니다." });
      return;
    }

    setIsChangingPassword(true);
    setMessage(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setMessage({ tone: "error", text: getAuthErrorMessage(error.message) });
      setIsChangingPassword(false);
      return;
    }

    setPassword("");
    setPasswordConfirm("");
    setMessage({ tone: "success", text: "비밀번호를 변경했습니다." });
    setIsChangingPassword(false);
  }

  async function handleSignOut() {
    setIsSigningOut(true);
    const result = await signOut();
    setIsSigningOut(false);

    if (result.errorMessage) {
      setMessage({ tone: "error", text: result.errorMessage });
      return;
    }

    router.replace("/");
  }

  async function deleteAccount() {
    if (!supabase || !session?.access_token || !user?.email || deleteConfirmation.trim() !== "계정 삭제" || !deletePassword) return;

    setIsDeleting(true);
    setMessage(null);

    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email: user.email,
      password: deletePassword
    });

    if (reauthError) {
      setMessage({ tone: "error", text: "비밀번호를 다시 확인해주세요." });
      setIsDeleting(false);
      return;
    }

    const response = await fetch("/api/account/delete", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        confirmation: deleteConfirmation.trim()
      })
    });
    const result = (await response.json()) as { ok: boolean; message: string };

    if (!response.ok || !result.ok) {
      setMessage({ tone: "error", text: result.message || "계정을 삭제하지 못했습니다." });
      setIsDeleting(false);
      return;
    }

    await signOut();
    router.replace("/");
  }

  return (
    <AuthLayout title="계정 설정" description="SHIM.AI 계정과 개인 데이터 관리 설정입니다.">
      {!isConfigured ? (
        <AuthMessage tone="error" message="Supabase 환경변수가 아직 설정되지 않았습니다. .env.local을 먼저 확인해주세요." />
      ) : null}

      {message ? <AuthMessage tone={message.tone} message={message.text} /> : null}
      {isLoading ? <AuthMessage message="계정 정보를 확인하고 있어요." /> : null}

      {user ? (
        <div className="account-panel account-settings-panel">
          <section>
            <span>이메일</span>
            <strong>{user.email}</strong>
            <p>이메일 변경은 추후 기능으로 준비합니다.</p>
          </section>

          <form onSubmit={saveProfile}>
            <label>
              <span>닉네임</span>
              <input
                maxLength={40}
                onChange={(event) => setNickname(event.target.value)}
                placeholder="보고서와 Diary에 표시할 이름"
                type="text"
                value={nickname}
              />
            </label>
            <button className="secondary-button" disabled={isSavingProfile} type="submit">
              <Save size={16} aria-hidden="true" />
              {isSavingProfile ? "저장 중..." : "닉네임 저장"}
            </button>
          </form>

          <section>
            <span>약관 및 동의</span>
            <p>
              현재 약관 버전 {consent?.terms_version || TERMS_VERSION}, 개인정보처리방침 버전{" "}
              {consent?.privacy_version || PRIVACY_VERSION}
            </p>
            <label className="account-toggle-row">
              <input
                checked={marketingAgreed}
                onChange={(event) => setMarketingAgreed(event.target.checked)}
                type="checkbox"
              />
              <span>서비스 소식 수신 동의</span>
            </label>
            <button className="secondary-button" disabled={isSavingConsent} onClick={saveMarketingConsent} type="button">
              <Save size={16} aria-hidden="true" />
              {isSavingConsent ? "저장 중..." : "동의 상태 저장"}
            </button>
            <div className="auth-links">
              <Link href="/terms">이용약관 보기</Link>
              <Link href="/privacy">개인정보처리방침 보기</Link>
            </div>
          </section>

          <form onSubmit={changePassword}>
            <label>
              <span>새 비밀번호</span>
              <input
                autoComplete="new-password"
                minLength={8}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="8자 이상 입력해주세요"
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
                type="password"
                value={passwordConfirm}
              />
            </label>
            <button className="secondary-button" disabled={isChangingPassword || !password.trim()} type="submit">
              <KeyRound size={16} aria-hidden="true" />
              {isChangingPassword ? "변경 중..." : "비밀번호 변경"}
            </button>
          </form>

          <button className="secondary-button account-logout" disabled={isSigningOut} onClick={handleSignOut} type="button">
            <LogOut size={17} aria-hidden="true" />
            {isSigningOut ? "로그아웃 중..." : "로그아웃"}
          </button>

          <section className="account-danger-zone">
            <span>계정 삭제</span>
            <p>
              계정을 삭제하면 계정 및 프로필, SHIM Diary 기록, 동의 이력이 함께 삭제됩니다. 삭제한 계정과 기록은
              복구할 수 없습니다.
            </p>
            <label>
              <span>삭제하려면 “계정 삭제”를 입력해주세요.</span>
              <input
                onChange={(event) => setDeleteConfirmation(event.target.value)}
                placeholder="계정 삭제"
                type="text"
                value={deleteConfirmation}
              />
            </label>
            <label>
              <span>본인 확인을 위해 비밀번호를 입력해주세요.</span>
              <input
                autoComplete="current-password"
                onChange={(event) => setDeletePassword(event.target.value)}
                placeholder="현재 비밀번호"
                type="password"
                value={deletePassword}
              />
            </label>
            <button
              className="account-delete-button"
              disabled={isDeleting || deleteConfirmation.trim() !== "계정 삭제" || !deletePassword}
              onClick={deleteAccount}
              type="button"
            >
              <Trash2 size={16} aria-hidden="true" />
              {isDeleting ? "삭제 중..." : "계정과 데이터 삭제"}
            </button>
          </section>
        </div>
      ) : null}

      <div className="auth-links">
        <Link href="/diary">SHIM Diary로 이동</Link>
        <Link href="/">홈으로 이동</Link>
      </div>
    </AuthLayout>
  );
}
