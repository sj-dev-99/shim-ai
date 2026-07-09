import type { NextApiRequest, NextApiResponse } from "next";
import { getAdminData } from "../../../lib/admin/adminRepository";
import { isAdminRequestAuthenticated } from "../../../lib/admin/session";
import { AdminData } from "../../../lib/admin/types";

type ApiResponse = {
  ok: boolean;
  data?: AdminData;
  error?: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<ApiResponse>) {
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");

  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  if (!isAdminRequestAuthenticated(req)) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }

  return res.status(200).json({
    ok: true,
    data: await getAdminData()
  });
}
