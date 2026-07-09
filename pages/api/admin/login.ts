import type { NextApiRequest, NextApiResponse } from "next";
import {
  createAdminSessionCookie,
  isAdminPasswordConfigured,
  verifyAdminPassword
} from "../../../lib/admin/session";

type LoginResponse = {
  ok: boolean;
  error?: string;
};

export default function handler(req: NextApiRequest, res: NextApiResponse<LoginResponse>) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (!isAdminPasswordConfigured()) {
    return res.status(500).json({ ok: false, error: "관리자 비밀번호가 설정되지 않았습니다." });
  }

  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!verifyAdminPassword(password)) {
    return res.status(401).json({ ok: false, error: "비밀번호가 올바르지 않습니다." });
  }

  res.setHeader("Set-Cookie", createAdminSessionCookie());
  return res.status(200).json({ ok: true });
}
