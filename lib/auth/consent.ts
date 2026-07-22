export const TERMS_VERSION = "1.0";
export const PRIVACY_VERSION = "1.0";

const PENDING_CONSENT_KEY = "shim_ai_pending_user_consent";

export type PendingUserConsent = {
  termsVersion: string;
  privacyVersion: string;
  marketingAgreed: boolean;
  createdAt: string;
};

export function savePendingConsent(marketingAgreed: boolean) {
  if (typeof window === "undefined") return;

  const payload: PendingUserConsent = {
    termsVersion: TERMS_VERSION,
    privacyVersion: PRIVACY_VERSION,
    marketingAgreed,
    createdAt: new Date().toISOString()
  };

  try {
    window.localStorage.setItem(PENDING_CONSENT_KEY, JSON.stringify(payload));
  } catch {
    // Consent can still be collected again from the account flow if local storage is unavailable.
  }
}

export function readPendingConsent() {
  if (typeof window === "undefined") return null;

  try {
    const raw = window.localStorage.getItem(PENDING_CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PendingUserConsent;
    if (!parsed.termsVersion || !parsed.privacyVersion) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearPendingConsent() {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(PENDING_CONSENT_KEY);
  } catch {
    // Non-critical cleanup.
  }
}
