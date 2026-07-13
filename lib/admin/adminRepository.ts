import { mockAdminData } from "./mockData";
import {
  AdminData,
  AiRating,
  BugReport,
  BugReportStatus,
  Feedback,
  FeedbackStatus,
  VisitorLog
} from "./types";

type BetaEventRecord = {
  id: string;
  event_type: string;
  path: string | null;
  visitor_id: string | null;
  version: string | null;
  message: string | null;
  rating: "up" | "down" | null;
  score: number | null;
  result_type: string | null;
  user_agent: string | null;
  metadata: Record<string, unknown> | null;
  status: string | null;
  admin_memo: string | null;
  created_at: string;
};

export type PersistedBetaEvent = {
  eventType: string;
  path: string;
  visitorId: string;
  version: string;
  message?: string;
  rating?: "up" | "down";
  score?: number;
  resultType?: string;
  userAgent?: string;
  createdAt: string;
  metadata?: Record<string, unknown>;
};

type UpdateRecordInput = {
  id: string;
  status?: FeedbackStatus | BugReportStatus;
  adminMemo?: string;
};

const EVENT_TABLE = process.env.SUPABASE_BETA_EVENTS_TABLE || "beta_events";

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceRoleKey) return null;

  return {
    restUrl: `${url.replace(/\/$/, "")}/rest/v1/${EVENT_TABLE}`,
    serviceRoleKey
  };
}

function cloneAdminData(data: AdminData): AdminData {
  return {
    feedbacks: data.feedbacks.map((item) => ({ ...item })),
    bugReports: data.bugReports.map((item) => ({ ...item })),
    aiRatings: data.aiRatings.map((item) => ({ ...item })),
    visitorLogs: data.visitorLogs.map((item) => ({ ...item })),
    versionNotes: data.versionNotes.map((item) => ({ ...item })),
    dataSource: data.dataSource,
    storageStatus: data.storageStatus,
    storageMessage: data.storageMessage
  };
}

function withMockMeta(data: AdminData): AdminData {
  return {
    ...cloneAdminData(data),
    feedbacks: data.feedbacks.map((item) => ({ ...item, source: "mock" })),
    bugReports: data.bugReports.map((item) => ({ ...item, source: "mock" })),
    aiRatings: data.aiRatings.map((item) => ({ ...item, source: "mock" })),
    visitorLogs: data.visitorLogs.map((item) => ({ ...item, source: "mock" })),
    versionNotes: data.versionNotes.map((item) => ({ ...item, source: "mock" })),
    dataSource: "mock",
    storageStatus: "not_configured",
    storageMessage: "Supabase 환경변수가 아직 연결되지 않아 샘플 데이터를 표시하고 있습니다."
  };
}

function parseBrowser(userAgent?: string | null) {
  if (!userAgent) return "알 수 없음";
  if (userAgent.includes("Edg/")) return "Edge";
  if (userAgent.includes("SamsungBrowser")) return "Samsung Internet";
  if (userAgent.includes("Chrome/") && !userAgent.includes("Chromium")) return "Chrome";
  if (userAgent.includes("Safari/") && !userAgent.includes("Chrome/")) return "Safari";
  if (userAgent.includes("Firefox/")) return "Firefox";
  return "기타 브라우저";
}

function parseDevice(userAgent?: string | null) {
  if (!userAgent) return "알 수 없음";
  if (/iPhone/i.test(userAgent)) return "iPhone";
  if (/iPad/i.test(userAgent)) return "iPad";
  if (/Android/i.test(userAgent)) return "Android";
  if (/Macintosh|Mac OS X/i.test(userAgent)) return "Mac";
  if (/Windows/i.test(userAgent)) return "Windows";
  return "기타 기기";
}

async function supabaseFetch(path: string, init?: RequestInit) {
  const config = getSupabaseConfig();
  if (!config) return null;
  const extraHeaders =
    init?.headers && !Array.isArray(init.headers) && !(init.headers instanceof Headers)
      ? init.headers
      : {};

  const response = await fetch(`${config.restUrl}${path}`, {
    ...init,
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      ...extraHeaders
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Supabase request failed: ${response.status} ${body}`);
  }

  return response;
}

function eventToFeedback(event: BetaEventRecord): Feedback {
  return {
    id: event.id,
    userName: "익명",
    rating: event.score || 0,
    message: event.message || "",
    createdAt: event.created_at,
    status: (event.status as FeedbackStatus) || "new",
    adminMemo: event.admin_memo || "",
    source: "live"
  };
}

function eventToBugReport(event: BetaEventRecord): BugReport {
  return {
    id: event.id,
    page: event.path || "/",
    message: event.message || "",
    device: parseDevice(event.user_agent),
    browser: parseBrowser(event.user_agent),
    createdAt: event.created_at,
    status: (event.status as BugReportStatus) || "new",
    adminMemo: event.admin_memo || "",
    source: "live"
  };
}

function eventToRating(event: BetaEventRecord): AiRating {
  return {
    id: event.id,
    rating: event.rating || "opinion",
    comment: event.message || "",
    resultType: event.result_type || "결과 미확인",
    createdAt: event.created_at,
    source: "live"
  };
}

function eventToVisitorLog(event: BetaEventRecord): VisitorLog {
  const completedTest =
    event.path === "/result" ||
    event.event_type === "satisfaction" ||
    event.event_type === "result_opinion" ||
    Boolean(event.metadata?.completedTest);

  return {
    id: event.id,
    visitedAt: event.created_at,
    page: event.path || "/",
    device: parseDevice(event.user_agent),
    browser: parseBrowser(event.user_agent),
    completedTest,
    exitPoint: typeof event.metadata?.exitPoint === "string" ? event.metadata.exitPoint : event.path || "/",
    source: "live"
  };
}

function buildAdminDataFromEvents(events: BetaEventRecord[]): AdminData {
  const feedbacks = events.filter((event) => event.event_type === "feedback").map(eventToFeedback);
  const bugReports = events.filter((event) => event.event_type === "bug_report").map(eventToBugReport);
  const aiRatings = events
    .filter((event) => event.event_type === "satisfaction" || event.event_type === "result_opinion")
    .map(eventToRating);
  const visitorLogs = events.filter((event) => event.event_type === "page_view").map(eventToVisitorLog);

  return {
    feedbacks,
    bugReports,
    aiRatings,
    visitorLogs,
    versionNotes: mockAdminData.versionNotes.map((item) => ({ ...item, source: "mock" })),
    dataSource: "live",
    storageStatus: "connected",
    storageMessage: "Supabase beta_events 테이블에서 실제 베타 데이터를 읽고 있습니다."
  };
}

export function isLiveStorageConfigured() {
  return Boolean(getSupabaseConfig());
}

export async function saveBetaEvent(event: PersistedBetaEvent) {
  if (!isLiveStorageConfigured()) return false;

  await supabaseFetch("", {
    method: "POST",
    headers: {
      Prefer: "return=minimal"
    },
    body: JSON.stringify({
      event_type: event.eventType,
      path: event.path,
      visitor_id: event.visitorId,
      version: event.version,
      message: event.message || null,
      rating: event.rating || null,
      score: event.score ?? null,
      result_type: event.resultType || null,
      user_agent: event.userAgent || null,
      metadata: event.metadata || null,
      status: event.eventType === "bug_report" || event.eventType === "feedback" ? "new" : null,
      admin_memo: "",
      created_at: event.createdAt
    })
  });

  return true;
}

export async function getAdminData(): Promise<AdminData> {
  if (!isLiveStorageConfigured()) {
    return withMockMeta(mockAdminData);
  }

  try {
    const response = await supabaseFetch("?select=*&order=created_at.desc&limit=500");
    const events = response ? ((await response.json()) as BetaEventRecord[]) : [];
    return buildAdminDataFromEvents(events);
  } catch (error) {
    console.error("[admin-data-error]", error);
    return {
      ...withMockMeta(mockAdminData),
      storageStatus: "error",
      storageMessage: "Supabase 데이터를 읽지 못해 샘플 데이터를 표시하고 있습니다."
    };
  }
}

export async function getPublicStats() {
  if (!isLiveStorageConfigured()) {
    return {
      recommendedParticipationCount: null
    };
  }

  try {
    const response = await supabaseFetch(
      "?select=id&event_type=eq.page_view&path=like.%2Fresult%25",
      {
        method: "HEAD",
        headers: {
          Prefer: "count=exact"
        }
      }
    );
    const count = response ? Number(response.headers.get("content-range")?.split("/")?.[1]) : NaN;

    return {
      recommendedParticipationCount: Number.isFinite(count) ? count : null
    };
  } catch (error) {
    console.error("[public-stats-error]", error);
    return {
      recommendedParticipationCount: null
    };
  }
}

export async function updateFeedbackRecord(input: UpdateRecordInput) {
  return updateAdminRecord(input);
}

export async function updateBugReportRecord(input: UpdateRecordInput) {
  return updateAdminRecord(input);
}

async function updateAdminRecord(input: UpdateRecordInput) {
  if (!isLiveStorageConfigured()) return false;

  await supabaseFetch(`?id=eq.${encodeURIComponent(input.id)}`, {
    method: "PATCH",
    headers: {
      Prefer: "return=minimal"
    },
    body: JSON.stringify({
      ...(input.status ? { status: input.status } : {}),
      ...(typeof input.adminMemo === "string" ? { admin_memo: input.adminMemo } : {})
    })
  });

  return true;
}
