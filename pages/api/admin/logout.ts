import type { NextApiRequest, NextApiResponse } from "next";
import { clearAdminSessionCookie } from "../../../lib/admin/session";

type ApiResponse = {
  ok: boolean;
  error?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");

  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  res.setHeader("Set-Cookie", clearAdminSessionCookie());
  return res.status(200).json({ ok: true });
}
