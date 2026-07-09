import type { NextApiRequest, NextApiResponse } from "next";

type BetaEvent = {
  eventType?: string;
  path?: string;
  visitorId?: string;
  version?: string;
  message?: string;
  rating?: string;
  score?: number;
  resultType?: string;
  userAgent?: string;
  createdAt?: string;
  metadata?: Record<string, unknown>;
};

type ApiResponse = {
  ok: boolean;
  error?: string;
};

const allowedEvents = new Set(["page_view", "feedback", "bug_report", "satisfaction", "result_opinion"]);

function trimString(value: unknown, maxLength: number) {
  if (typeof value !== "string") return undefined;
  return value.trim().slice(0, maxLength);
}

function sanitizeEvent(body: BetaEvent) {
  const eventType = trimString(body.eventType, 40);
  if (!eventType || !allowedEvents.has(eventType)) return null;

  return {
    eventType,
    path: trimString(body.path, 200) || "/",
    visitorId: trimString(body.visitorId, 120) || "unknown",
    version: trimString(body.version, 40) || "unknown",
    message: trimString(body.message, 2000),
    rating: body.rating === "up" || body.rating === "down" ? body.rating : undefined,
    score: typeof body.score === "number" ? body.score : undefined,
    resultType: trimString(body.resultType, 120),
    userAgent: trimString(body.userAgent, 300),
    createdAt: trimString(body.createdAt, 40) || new Date().toISOString(),
    metadata: body.metadata && typeof body.metadata === "object" ? body.metadata : undefined
  };
}

async function forwardToWebhook(event: ReturnType<typeof sanitizeEvent>) {
  const webhookUrl = process.env.BETA_EVENT_WEBHOOK_URL;
  if (!webhookUrl || !event) return;

  const headers: Record<string, string> = {
    "Content-Type": "application/json"
  };

  if (process.env.BETA_EVENT_WEBHOOK_TOKEN) {
    headers.Authorization = `Bearer ${process.env.BETA_EVENT_WEBHOOK_TOKEN}`;
  }

  await fetch(webhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(event)
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const event = sanitizeEvent(req.body);
  if (!event) {
    return res.status(400).json({ ok: false, error: "Invalid beta event" });
  }

  console.info("[beta-event]", JSON.stringify(event));

  try {
    await forwardToWebhook(event);
  } catch (error) {
    console.error("[beta-event-forward-error]", error);
  }

  return res.status(200).json({ ok: true });
}
