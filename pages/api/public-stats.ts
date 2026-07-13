import type { NextApiRequest, NextApiResponse } from "next";
import { getPublicStats } from "../../lib/admin/adminRepository";

type PublicStatsResponse = {
  ok: boolean;
  recommendedParticipationCount: number | null;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<PublicStatsResponse>) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, recommendedParticipationCount: null });
  }

  const stats = await getPublicStats();
  return res.status(200).json({
    ok: true,
    recommendedParticipationCount: stats.recommendedParticipationCount
  });
}
