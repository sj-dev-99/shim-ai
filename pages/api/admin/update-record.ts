import type { NextApiRequest, NextApiResponse } from "next";
import {
  updateBugReportRecord,
  updateFeedbackRecord
} from "../../../lib/admin/adminRepository";
import { isAdminRequestAuthenticated } from "../../../lib/admin/session";
import { BugReportStatus, FeedbackStatus } from "../../../lib/admin/types";

type ApiResponse = {
  ok: boolean;
  error?: string;
};

const feedbackStatuses = new Set<FeedbackStatus>(["new", "reviewing", "completed"]);
const bugStatuses = new Set<BugReportStatus>(["new", "reviewing", "fixed"]);

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (!isAdminRequestAuthenticated(req)) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  const id = typeof req.body?.id === "string" ? req.body.id : "";
  const type = req.body?.type === "feedback" || req.body?.type === "bug" ? req.body.type : null;
  const adminMemo = typeof req.body?.adminMemo === "string" ? req.body.adminMemo.slice(0, 2000) : undefined;
  const status = typeof req.body?.status === "string" ? req.body.status : undefined;

  if (!id || !type) {
    return res.status(400).json({ ok: false, error: "Invalid record update" });
  }

  if (type === "feedback") {
    if (status && !feedbackStatuses.has(status as FeedbackStatus)) {
      return res.status(400).json({ ok: false, error: "Invalid feedback status" });
    }
    await updateFeedbackRecord({ id, status: status as FeedbackStatus | undefined, adminMemo });
    return res.status(200).json({ ok: true });
  }

  if (status && !bugStatuses.has(status as BugReportStatus)) {
    return res.status(400).json({ ok: false, error: "Invalid bug status" });
  }
  await updateBugReportRecord({ id, status: status as BugReportStatus | undefined, adminMemo });
  return res.status(200).json({ ok: true });
}
