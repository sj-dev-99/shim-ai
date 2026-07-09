export const BETA_VERSION =
  process.env.NEXT_PUBLIC_BETA_VERSION && process.env.NEXT_PUBLIC_BETA_VERSION.trim().length > 0
    ? process.env.NEXT_PUBLIC_BETA_VERSION
    : "Beta v0.1.1";

export type BetaEventType =
  | "page_view"
  | "feedback"
  | "bug_report"
  | "satisfaction"
  | "result_opinion";

export type BetaEventPayload = {
  eventType: BetaEventType;
  path?: string;
  message?: string;
  rating?: "up" | "down";
  score?: number;
  resultType?: string;
  metadata?: Record<string, string | number | boolean | null>;
};

function getVisitorId() {
  try {
    const key = "shim_ai_visitor_id";
    const existing = window.localStorage.getItem(key);
    if (existing) return existing;

    const generated =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `visitor_${Date.now()}_${Math.random().toString(16).slice(2)}`;
    window.localStorage.setItem(key, generated);
    return generated;
  } catch {
    return "storage_unavailable";
  }
}

export function submitBetaEvent(payload: BetaEventPayload) {
  if (typeof window === "undefined") return Promise.resolve(false);

  const body = JSON.stringify({
    ...payload,
    path: payload.path || window.location.pathname,
    visitorId: getVisitorId(),
    version: BETA_VERSION,
    userAgent: window.navigator.userAgent,
    createdAt: new Date().toISOString()
  });

  if (navigator.sendBeacon && payload.eventType === "page_view") {
    const sent = navigator.sendBeacon("/api/beta-events", new Blob([body], { type: "application/json" }));
    return Promise.resolve(sent);
  }

  return fetch("/api/beta-events", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body,
    keepalive: true
  }).then((response) => response.ok);
}
